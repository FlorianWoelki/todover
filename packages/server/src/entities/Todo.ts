import { Field, ID, ObjectType } from 'type-graphql';
import { List } from './List';
import { User } from './User';

export type TodoRepetition = 'weekly' | 'daily';

@ObjectType()
export class Todo {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => User)
  user: User;

  @Field({ defaultValue: false })
  done: boolean;

  @Field({ nullable: true })
  date?: Date;

  @Field({ nullable: true })
  repetition?: TodoRepetition;

  @Field(() => List, { nullable: true })
  list?: List;

  @Field({ nullable: true })
  listId?: string;

  @Field({ nullable: true })
  description?: string;
}
