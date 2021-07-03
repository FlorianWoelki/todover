import { IsEnum } from 'class-validator';
import { Field, InputType } from 'type-graphql';

enum Language {
  en = 'en',
  de = 'de',
}

@InputType()
export class UpdateSettingsInput {
  @Field()
  @IsEnum(Language)
  language: Language;
}
