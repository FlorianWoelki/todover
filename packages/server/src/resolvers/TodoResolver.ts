import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Todo } from '../entities/Todo';
import { isAuth } from '../isAuth';
import { MyContext } from '../MyContext';

@Resolver()
export class TodoResolver {
  @Query(() => [Todo])
  @UseMiddleware(isAuth)
  getTodos(@Ctx() { prisma, payload }: MyContext) {
    if (!payload) {
      return;
    }

    return prisma.todo.findMany({ where: { userId: payload.userId } });
  }

  @Mutation()
  @UseMiddleware(isAuth)
  addTodo(@Ctx() { prisma, payload }: MyContext, @Arg('name') name: string) {
    if (!payload) {
      return;
    }

    return prisma.todo.create({ data: { name, userId: payload.userId } });
  }

  @Mutation()
  @UseMiddleware(isAuth)
  removeTodo(@Ctx() { prisma, payload }: MyContext, @Arg('id') id: string) {
    if (!payload) {
      return;
    }

    return prisma.todo.delete({ where: { id } });
  }
}
