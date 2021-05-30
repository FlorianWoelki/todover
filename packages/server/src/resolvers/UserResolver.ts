import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { User } from '../entities/User';
import { MyContext } from '../MyContext';
import { LoginResponse } from '../entities/LoginResponse';
import { createAccessToken, createRefreshToken } from '../auth';
import { sendRefreshToken } from '../sendRefreshToken';
import { isAuth } from '../isAuth';
import { revokeRefreshToken } from '../utils/revokeRefreshToken';

@Resolver()
export class UserResolver {
  @Query(() => User)
  @UseMiddleware(isAuth)
  me(@Ctx() { prisma, payload }: MyContext) {
    if (!payload) {
      return;
    }

    return prisma.user.findFirst({ where: { id: payload.userId } });
  }

  @Mutation(() => User, { nullable: true })
  async forgotPassword(
    @Ctx() { prisma }: MyContext,
    @Arg('userId', () => Int) userId: number
  ): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return undefined;
    }

    await revokeRefreshToken(prisma, userId);
    return user;
  }

  @Mutation(() => User)
  async register(
    @Ctx() { prisma }: MyContext,
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    const hashedPassword = await hash(password, 12);

    const user = prisma.user.create({ data: { email, password: hashedPassword } });
    return user;
  }

  @Mutation(() => LoginResponse, { nullable: true })
  async login(
    @Ctx() { prisma, res }: MyContext,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<LoginResponse | undefined> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return undefined;
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      return undefined;
    }

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
    };
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async removeUser(@Ctx() { prisma, payload }: MyContext) {
    if (!payload) {
      return;
    }

    return prisma.user.delete({ where: { id: payload.userId } });
  }
}
