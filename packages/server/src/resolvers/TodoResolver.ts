import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Todo as PrismaTodo } from '.prisma/client';
import { Todo } from '../entities/Todo';
import { isAuth } from '../isAuth';
import { MyContext } from '../MyContext';
import { UpdateTodoInput } from './input/UpdateTodoInput';

@Resolver()
export class TodoResolver {
  @Query(() => [Todo])
  @UseMiddleware(isAuth)
  todos(@Ctx() { prisma, payload }: MyContext): Promise<PrismaTodo[]> | null {
    if (!payload) {
      return null;
    }

    return prisma.todo.findMany({ where: { userId: payload.userId } });
  }

  @Mutation(() => Todo)
  @UseMiddleware(isAuth)
  updateTodo(
    @Ctx() { prisma, payload }: MyContext,
    @Arg('id') id: string,
    @Arg('data') data: UpdateTodoInput
  ): Promise<PrismaTodo> | null {
    if (!payload) {
      return null;
    }

    return prisma.todo.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  @Mutation(() => Todo)
  @UseMiddleware(isAuth)
  addTodoWithDate(
    @Ctx() { prisma, payload }: MyContext,
    @Arg('name') name: string,
    @Arg('date') date: Date
  ): Promise<PrismaTodo> | null {
    if (!payload) {
      return null;
    }

    return prisma.todo.create({ data: { userId: payload.userId, date, name } });
  }

  @Mutation(() => Todo)
  @UseMiddleware(isAuth)
  removeTodo(
    @Ctx() { prisma, payload }: MyContext,
    @Arg('id') id: string
  ): Promise<PrismaTodo> | null {
    if (!payload) {
      return null;
    }

    return prisma.todo.delete({ where: { id } });
  }

  @Mutation(() => Todo)
  @UseMiddleware(isAuth)
  moveToList(
    @Ctx() { prisma, payload }: MyContext,
    @Arg('todoId') todoId: string,
    @Arg('listId') listId: string
  ): Promise<PrismaTodo> | null {
    if (!payload) {
      return null;
    }

    return prisma.todo.update({ where: { id: todoId }, data: { listId, date: null } });
  }
}
