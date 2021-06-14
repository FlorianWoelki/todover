import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import { verify } from 'jsonwebtoken';
import { MyContext } from './MyContext';
import { createAccessToken, createRefreshToken } from './auth';
import { sendRefreshToken } from './sendRefreshToken';
import { createSchema } from './utils/createSchema';

(async () => {
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // TODO: change to env variables
    credentials: true,
    optionsSuccessStatus: 204,
  };

  const prisma = new PrismaClient();
  const app = express();
  app.use(cors(corsOptions));
  app.use(cookieParser());

  app.post('/refresh_token', async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: '' });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: '' });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return res.send({ ok: false, accessToken: '' });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: '' });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    context: ({ req, res }): MyContext => ({ res, req, prisma }),
  });

  apolloServer.applyMiddleware({ app, path: '/graphql', cors: corsOptions });

  app.listen(4000, () => {
    console.log('server started on port 4000');
  });
})();
