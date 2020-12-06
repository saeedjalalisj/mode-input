import { IsEmail, IsString, IsOptional } from 'class-validator';

export class CreateCampaignResponseDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  star?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
