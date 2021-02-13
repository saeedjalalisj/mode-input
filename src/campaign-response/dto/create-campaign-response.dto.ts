import { IsEmail, IsString, IsOptional } from 'class-validator';

export class CreateCampaignResponseDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEmail()
  mobile?: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  rate?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsString()
  trackingId?: string;
}
