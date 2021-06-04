import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { List as PrismaList, Todo as PrismaTodo } from '.prisma/client';
import { List } from '../entities/List';
import { isAuth } from '../isAuth';
import { MyContext } from '../MyContext';

@Resolver(() => List)
export class ListResolver {
  @Mutation(() => List)
  @UseMiddleware(isAuth)
  createList(
    @Ctx() { prisma, payload }: MyContext,
    @Arg('name') name: string
  ): Promise<PrismaList> | null {
    if (!payload) {
      return null;
    }

    return prisma.list.create({ data: { name, userId: payload.userId } });
  }

  @Mutation(() => List)
  @UseMiddleware(isAuth)
  deleteList(
    @Ctx() { prisma, payload }: MyContext,
    @Arg('id') id: string
  ): Promise<PrismaList> | null {
    if (!payload) {
      return null;
    }

    return prisma.list.delete({ where: { id } });
  }

  @Query(() => [List])
  @UseMiddleware(isAuth)
  lists(@Ctx() { prisma, payload }: MyContext): Promise<PrismaList[]> | null {
    if (!payload) {
      return null;
    }

    return prisma.list.findMany({ where: { userId: payload.userId } });
  }

  @FieldResolver()
  todos(@Root() list: List, @Ctx() { prisma }: MyContext): Promise<PrismaTodo[]> {
    return prisma.todo.findMany({ where: { listId: list.id } });
  }
}
