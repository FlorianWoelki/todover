import { IsEnum } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Priority, Todo, TodoRepetition } from '../../entities/Todo';

@InputType()
export class UpdateTodoInput implements Partial<Todo> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field({ nullable: true })
  @IsEnum(Priority)
  priority?: Priority;

  @Field({ nullable: true })
  @IsEnum(TodoRepetition)
  repetition?: TodoRepetition;

  @Field({ nullable: true })
  done?: boolean;

  @Field({ nullable: true })
  listId?: string;

  @Field({ nullable: true })
  description?: string;
}
