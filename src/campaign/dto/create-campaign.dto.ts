import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  subtitle: string;
  @IsString()
  thanks_message: string;
  @IsString()
  email_status: string;
  @IsString()
  full_name_status: string;
  @IsString()
  star_status: string;
  @IsString()
  description_status: string;
  @IsNotEmpty()
  @IsString()
  type: string;
}
