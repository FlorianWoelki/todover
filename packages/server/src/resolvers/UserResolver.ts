import { Ctx, Query, Resolver } from 'type-graphql';
import { User } from '../entities/User';
import { MyContext } from '../MyContext';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(@Ctx() { prisma }: MyContext): Promise<User[]> {
    return prisma.user.findMany();
  }
}
