import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CampaignModule } from './campaign/campaign.module';
import { CampaignResponseModule } from './campaign-response/campaign-response.module';
import { TrackingCodeModule } from './tracking-code/tracking-code.module';
import { SiteModule } from './site/site.module';
import { SeederModule } from './seeder/seeder.module';
import configuration from './config/configuration';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://localhost/${
        process.env.NODE_ENV === 'development' ? 'um' : 'testDb'
      }`,
    ),
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.development.env'
          : '.test.env',
      load: [configuration],
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    CampaignModule,
    CampaignResponseModule,
    TrackingCodeModule,
    SiteModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
