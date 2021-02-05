import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CampaignModule } from './campaign/campaign.module';
import { CampaignResponseModule } from './campaign-response/campaign-response.module';
import configuration from './config/configuration';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/um'),
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      load: [configuration],
      isGlobal: true
    }),
    UserModule,
    AuthModule,
    CampaignModule,
    CampaignResponseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
