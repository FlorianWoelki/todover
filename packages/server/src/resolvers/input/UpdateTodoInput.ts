import { Field, InputType } from 'type-graphql';
import { Todo, TodoRepetition } from '../../entities/Todo';

@InputType()
export class UpdateTodoInput implements Partial<Todo> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field({ nullable: true })
  repetition?: TodoRepetition;

  @Field({ nullable: true })
  done?: boolean;

  @Field({ nullable: true })
  listId?: string;

  @Field({ nullable: true })
  description?: string;
}
