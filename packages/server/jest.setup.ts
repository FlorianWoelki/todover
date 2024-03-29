import 'reflect-metadata';

// set env variables that we need to connect o postgres db with prisma
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/todover?schema=public';
}
process.env.ACCESS_TOKEN_SECRET = 'accesstokensecret';
process.env.REFRESH_TOKEN_SECRET = 'refreshtokensecret';
