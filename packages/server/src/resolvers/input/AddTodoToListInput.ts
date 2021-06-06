import { Field, InputType } from 'type-graphql';
import { Todo } from '../../entities/Todo';

@InputType()
export class AddTodoToListInput implements Partial<Todo> {
  @Field()
  name: string;

  @Field()
  listId: string;
}
