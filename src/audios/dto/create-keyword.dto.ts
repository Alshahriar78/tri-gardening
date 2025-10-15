import { Transform } from 'class-transformer';
import { IsIn } from 'class-validator';

export class CreateKeywordDto {
  @Transform(({ value }) => value?.toLowerCase().trim()) 
  @IsIn([
    "popular", "latest", "grief_loss", "poems_poetry", "remembering", "heavenly",
    "faith_hope", "letters_to_heaven", "love", "mom_dad", "healing_from_regret",
    "stress_relief", "husband_wife", "compassion", "pet_loss", "forgiveness",
    "happy", "cardinal_goddess", "encouraging", "positive_thinking", "self_love",
    "wisdom", "gratitude", "focus_productivity", "overcoming_worry",
    "fathers_mothers_day", "morning_motivation", "nighttime_peace",
    "courage_confidence"
  ])
  keyword: string;
}
