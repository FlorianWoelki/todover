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
  addTodo(
    @Ctx() { prisma, payload }: MyContext,
    @Arg('name') name: string,
    @Arg('date', { nullable: true }) date?: Date,
    @Arg('listId', { nullable: true }) listId?: string
  ): Promise<PrismaTodo> | null {
    if (!payload) {
      return null;
    }

    return prisma.todo.create({ data: { name, userId: payload.userId, date, listId } });
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
