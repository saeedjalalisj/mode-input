import { Module } from '@nestjs/common';
import { CampaignResponseService } from './campaign-response.service';
import { CampaignResponseController } from './campaign-response.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignResponse, CampaignResponseSchema } from './entities/campaign-response.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: CampaignResponse.name, schema: CampaignResponseSchema}])],
  controllers: [CampaignResponseController],
  providers: [CampaignResponseService]
})
export class CampaignResponseModule {}
