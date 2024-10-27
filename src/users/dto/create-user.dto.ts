import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsOptional()
  first_name: string;
  @IsString()
  @IsOptional()
  last_name: string;
  @IsNumber()
  @IsOptional()
  age: number;
  @IsString()
  @IsOptional()
  password: string;
}
