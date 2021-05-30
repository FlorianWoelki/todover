import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { List } from '../entities/List';
import { isAuth } from '../isAuth';
import { MyContext } from '../MyContext';

@Resolver()
export class ListResolver {
  @Mutation(() => List)
  @UseMiddleware(isAuth)
  createList(@Ctx() { prisma, payload }: MyContext, @Arg('name') name: string) {
    if (!payload) {
      return null;
    }

    return prisma.list.create({ data: { name, userId: payload.userId } });
  }

  @Mutation(() => List)
  @UseMiddleware(isAuth)
  deleteList(@Ctx() { prisma, payload }: MyContext, @Arg('id') id: string) {
    if (!payload) {
      return null;
    }

    return prisma.list.delete({ where: { id } });
  }

  @Query(() => [List])
  @UseMiddleware(isAuth)
  lists(@Ctx() { prisma, payload }: MyContext) {
    if (!payload) {
      return null;
    }

    return prisma.list.findMany({ where: { userId: payload.userId } });
  }
}
