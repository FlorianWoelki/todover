import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  password: string;

  tokenVersion: number;
}
