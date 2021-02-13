import { Module } from '@nestjs/common';
import { CampaignResponseService } from './campaign-response.service';
import { CampaignResponseController } from './campaign-response.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignResponse, CampaignResponseSchema } from './entities/campaign-response.schema';
import { Campaigns, CampaignsSchema } from '../campaign/entities/campaign.schema';
import { TrackingCodeService } from '../tracking-code/tracking-code.service';
import { TrackingCode, TrackingCodeSchema } from '../tracking-code/entities/tracking-code.entity';

@Module({
  imports:[MongooseModule.forFeature([
    { name: CampaignResponse.name, schema: CampaignResponseSchema},
    { name: Campaigns.name, schema: CampaignsSchema},
    { name: TrackingCode.name, schema: TrackingCodeSchema }
    ])],
  controllers: [CampaignResponseController],
  providers: [CampaignResponseService, TrackingCodeService]
})
export class CampaignResponseModule {}
