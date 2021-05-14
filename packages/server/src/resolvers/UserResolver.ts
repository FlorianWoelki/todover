import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { User } from '../entities/User';
import { MyContext } from '../MyContext';
import { LoginResponse } from '../entities/LoginResponse';
import { createAccessToken, createRefreshToken } from '../auth';
import { sendRefreshToken } from '../sendRefreshToken';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(@Ctx() { prisma }: MyContext): Promise<User[]> {
    return prisma.user.findMany();
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
}
