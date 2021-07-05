import { IsEmail, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MaxLength(60)
  password: string;
}
