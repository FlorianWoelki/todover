import { Field, ObjectType } from 'type-graphql';
import { User } from './User';

@ObjectType()
export class Setting {
  id: number;

  @Field()
  language: string;

  @Field(() => User)
  user: User;
}
