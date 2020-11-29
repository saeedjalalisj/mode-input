import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';

@Module({
  controllers: [CampaignController],
  providers: [CampaignService]
})
export class CampaignModule {}
