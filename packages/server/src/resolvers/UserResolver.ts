import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { User } from '../entities/User';
import { MyContext } from '../MyContext';
import { LoginResponse } from '../entities/LoginResponse';
import { createAccessToken, createRefreshToken, SALT } from '../auth';
import { sendRefreshToken } from '../sendRefreshToken';
import { isAuth } from '../isAuth';
import { revokeRefreshToken } from '../utils/revokeRefreshToken';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { Setting } from '../entities/Setting';
import { UpdateSettingsInput } from './input/UpdateSettingsInput';
import { UserInput } from './input/UserInput';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User)
  @UseMiddleware(isAuth)
  me(@Ctx() { prisma, payload }: MyContext): Promise<User | null> | null {
    if (!payload) {
      throw new AuthenticationError('You are not logged in');
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
      throw new UserInputError('Specified `userId` could not be');
    }

    await revokeRefreshToken(prisma, userId);
    return user;
  }

  @Mutation(() => User)
  async register(@Ctx() { prisma }: MyContext, @Arg('data') data: UserInput): Promise<User> {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new UserInputError('Specified `email` already exists');
    }

    const hashedPassword = await hash(data.password, SALT);

    const user = prisma.user.create({
      data: { email: data.email.toLowerCase(), password: hashedPassword },
    });
    return user;
  }

  @Mutation(() => LoginResponse, { nullable: true })
  async login(
    @Ctx() { prisma, res }: MyContext,
    @Arg('data') data: UserInput
  ): Promise<LoginResponse | null> {
    const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (!user) {
      throw new UserInputError('Invalid credentials input');
    }

    const isValid = await compare(data.password, user.password);
    if (!isValid) {
      throw new UserInputError('Invalid credentials input');
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
      throw new AuthenticationError('You are not logged in');
    }

    return prisma.user.delete({ where: { id: payload.userId } });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  logout(@Ctx() { res }: MyContext): boolean {
    sendRefreshToken(res, '');
    return true;
  }

  @FieldResolver(() => Setting, { nullable: true })
  settings(@Root() user: User, @Ctx() { prisma }: MyContext): Promise<Setting | null> {
    return prisma.setting.findUnique({ where: { userId: user.id } });
  }

  @Mutation(() => Setting)
  @UseMiddleware(isAuth)
  async updateSettings(
    @Ctx() { prisma, payload }: MyContext,
    @Arg('data') data: UpdateSettingsInput
  ): Promise<Setting | null> {
    if (!payload) {
      return null;
    }

    // can be solved with triggers... not possible atm with prisma
    const settings = await prisma.setting.findUnique({ where: { userId: payload.userId } });
    if (!settings) {
      return prisma.setting.create({ data: { userId: payload.userId, ...data } });
    }

    return prisma.setting.update({ where: { userId: payload.userId }, data });
  }
}
