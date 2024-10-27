import { IsEmail, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;
  @IsOptional()
  code: number;
  // password: string;
}
