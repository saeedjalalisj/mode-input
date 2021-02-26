import { IsString, IsNotEmpty } from 'class-validator';

export class StatusCampaignResponseDto {
  @IsString()
  @IsNotEmpty()
  campId: string;

  @IsString()
  @IsNotEmpty()
  trackingCode: string;

  @IsString()
  @IsNotEmpty()
  siteId: string;
}
