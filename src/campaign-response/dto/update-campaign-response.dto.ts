import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignResponseDto } from './create-campaign-response.dto';

export class UpdateCampaignResponseDto extends PartialType(CreateCampaignResponseDto) {}
