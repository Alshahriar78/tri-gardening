import { IsString, IsEmail, IsOptional, IsInt, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsOptional()
  @IsInt()
  role_id?: number;
}

