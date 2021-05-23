import { Field, ObjectType } from 'type-graphql';
import { TodoRepetition } from '../../entities/Todo';

@ObjectType()
export class UpdateTodoInput {
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
