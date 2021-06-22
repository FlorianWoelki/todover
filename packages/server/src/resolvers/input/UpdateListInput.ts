import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateListInput {
  @Field()
  name: string;
}
