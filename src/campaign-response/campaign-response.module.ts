import { Module } from '@nestjs/common';
import { CampaignResponseService } from './campaign-response.service';
import { CampaignResponseController } from './campaign-response.controller';

@Module({
  controllers: [CampaignResponseController],
  providers: [CampaignResponseService]
})
export class CampaignResponseModule {}
