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
  me(@Ctx() { prisma, payload }: MyContext): Promise<User | null> | null {
    if (!payload) {
      return null;
    }

    return prisma.user.findUnique({ where: { id: payload.userId } });
  }

  @Mutation(() => User, { nullable: true })
  async forgotPassword(
    @Ctx() { prisma }: MyContext,
    @Arg('userId', () => Int) userId: number
  ): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return null;
    }

    await revokeRefreshToken(prisma, userId);
    return user;
  }

  @Mutation(() => User)
  async register(
    @Ctx() { prisma }: MyContext,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<User> {
    const hashedPassword = await hash(password, 12);

    const user = prisma.user.create({ data: { email, password: hashedPassword } });
    return user;
  }

  @Mutation(() => LoginResponse, { nullable: true })
  async login(
    @Ctx() { prisma, res }: MyContext,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<LoginResponse | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      return null;
    }

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
    };
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  removeUser(@Ctx() { prisma, payload }: MyContext): Promise<User> | null {
    if (!payload) {
      return null;
    }

    return prisma.user.delete({ where: { id: payload.userId } });
  }
}
