import { Field, ID, ObjectType } from 'type-graphql';
import { Todo } from './Todo';

@ObjectType()
export class List {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [Todo])
  todos: Todo[];
}
