import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from '../site/entities/site.entity';
import { User, UserSchema } from '../user/entities/user.schema';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import {
  Campaigns,
  CampaignsSchema,
} from '../campaign/entities/campaign.schema';
import {
  CampaignResponse,
  CampaignResponseSchema,
} from '../campaign-response/entities/campaign-response.schema';
import {
  TrackingCode,
  TrackingCodeSchema,
} from '../tracking-code/entities/tracking-code.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.development.env'
          : '.test.env',
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot(`mongodb://localhost/${process.env.DATABASE_NAME}`),
    MongooseModule.forFeature([
      { name: Site.name, schema: SiteSchema },
      { name: User.name, schema: UserSchema },
      { name: Campaigns.name, schema: CampaignsSchema },
      { name: CampaignResponse.name, schema: CampaignResponseSchema },
      { name: TrackingCode.name, schema: TrackingCodeSchema },
    ]),
  ],
  providers: [SeederService],
})
export class SeederModule {}
