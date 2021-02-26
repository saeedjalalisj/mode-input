import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaigns, CampaignsSchema } from './entities/campaign.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaigns.name, schema: CampaignsSchema },
    ]),
  ],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
