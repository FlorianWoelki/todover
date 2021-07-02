import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Setting {
  @Field()
  userId: number;

  @Field()
  language: string;
}
