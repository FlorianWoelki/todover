import { Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
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
  addTodo() {}

  @Mutation()
  @UseMiddleware(isAuth)
  removeTodo() {}
}
