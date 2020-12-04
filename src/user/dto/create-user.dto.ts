import {IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  family?: string;
}


