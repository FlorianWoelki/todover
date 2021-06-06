import { Field, InputType } from 'type-graphql';
import { Todo } from '../../entities/Todo';

@InputType()
export class AddTodoWithDateInput implements Partial<Todo> {
  @Field()
  name: string;

  @Field()
  date: Date;
}
