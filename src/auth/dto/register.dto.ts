import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  family: string;
}


