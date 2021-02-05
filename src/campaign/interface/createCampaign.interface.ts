import { CreateCampaignDto } from '../dto/create-campaign.dto';

export interface CreateCampaignInterface extends CreateCampaignDto {
   userId?: string;
}
