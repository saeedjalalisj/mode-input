import { CreateCampaignResponseDto } from '../dto/create-campaign-response.dto';


export interface CreateCampaignResponseInterface extends CreateCampaignResponseDto {
  campId: string;
}
