import { Module } from '@nestjs/common';
import { CampaignResponseService } from './campaign-response.service';
import { CampaignResponseController } from './campaign-response.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignResponse, CampaignResponseSchema } from './entities/campaign-response.schema';
import { Campaigns, CampaignsSchema } from '../campaign/entities/campaign.schema';

@Module({
  imports:[MongooseModule.forFeature([
    { name: CampaignResponse.name, schema: CampaignResponseSchema},
    { name: Campaigns.name, schema: CampaignsSchema},
    ])],
  controllers: [CampaignResponseController],
  providers: [CampaignResponseService]
})
export class CampaignResponseModule {}
