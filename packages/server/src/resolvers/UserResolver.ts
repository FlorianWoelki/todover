import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { User } from '../entities/User';
import { MyContext } from '../MyContext';
import { LoginResponse } from '../entities/LoginResponse';
import { createAccessToken, createRefreshToken } from '../auth';
import { sendRefreshToken } from '../sendRefreshToken';
import { isAuth } from '../isAuth';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(@Ctx() { prisma }: MyContext) {
    return prisma.user.findMany();
  }

  // TODO: remove and add export to custom function because it will not be used in prod
  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(
    @Ctx() { prisma }: MyContext,
    @Arg('userId', () => Int) userId: number
  ): Promise<boolean> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
    });
    return true;
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
