import { Field, ID, ObjectType } from 'type-graphql';

export type TodoRepetition = 'weekly' | 'daily';

@ObjectType()
export class Todo {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ defaultValue: false })
  done: boolean;

  @Field({ nullable: true })
  date?: Date;

  @Field({ nullable: true })
  repetition?: TodoRepetition;

  @Field({ nullable: true })
  listId?: string;

  @Field({ nullable: true })
  description?: string;
}
