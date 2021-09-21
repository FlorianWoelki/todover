import { Field, ID, Int, ObjectType } from 'type-graphql';
import { Todo } from './Todo';
import { User } from './User';

@ObjectType()
export class List {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  position: number;

  @Field(() => User)
  user: User;

  @Field(() => [Todo], { defaultValue: [] })
  todos: Todo[];
}
