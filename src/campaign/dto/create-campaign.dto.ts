import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  subtitle?: string;

  @IsNotEmpty()
  @IsBoolean()
  allow_rating: boolean;

  @IsBoolean()
  require_rating?: boolean;

  @IsNotEmpty()
  @IsBoolean()
  allow_full_name: boolean;

  @IsBoolean()
  require_full_name?: boolean;

  @IsNotEmpty()
  @IsBoolean()
  allow_email: boolean;

  @IsBoolean()
  require_email?: boolean;

  @IsNotEmpty()
  @IsBoolean()
  allow_mobile: boolean;

  @IsBoolean()
  require_mobile?: boolean;

  @IsNotEmpty()
  @IsBoolean()
  allow_comment: boolean;

  @IsBoolean()
  require_comment?: boolean;

  @IsString()
  thanks_message?: string;

  @IsBoolean()
  show_thanks_message?: boolean;

  @IsNotEmpty()
  @IsString()
  siteId: string;

}
