import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { hash } from 'bcryptjs';
import { User } from '../entities/User';
import { MyContext } from '../MyContext';

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
}
