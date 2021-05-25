import { Field, InputType } from 'type-graphql';
import { Todo, TodoRepetition } from '../../entities/Todo';

@InputType()
export class UpdateTodoInput implements Partial<Todo> {
  @Field()
  name?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field({ nullable: true })
  repetition?: TodoRepetition;

  @Field()
  done?: boolean;

  @Field()
  listId?: string;

  @Field()
  description?: string;
}
