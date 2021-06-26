import { Field, InputType } from 'type-graphql';
import { Todo, TodoRepetition } from '../../entities/Todo';

@InputType()
export class AddTodoWithDateInput implements Partial<Todo> {
  @Field()
  name: string;

  @Field()
  date: Date;

  @Field({ nullable: true })
  repetition?: TodoRepetition;

  @Field({ nullable: true })
  description?: string;
}
