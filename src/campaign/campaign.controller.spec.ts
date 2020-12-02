import { Test, TestingModule } from '@nestjs/testing';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from "mongoose";
import { MongooseModule } from '@nestjs/mongoose';
import { Campaigns, CampaignsSchema } from './entities/campaign.schema';

describe('CampaignController', () => {
  let controller: CampaignController;

  let mongod: MongoMemoryServer = new MongoMemoryServer({
    autoStart: true,
  });

  afterEach(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    mongod = new MongoMemoryServer();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignController],
      providers: [CampaignService],
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: await mongod.getUri(),
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
          }),
        }),
        MongooseModule.forFeature([
          { name: Campaigns.name, schema: CampaignsSchema },
        ]),
        ]
    }).compile();

    controller = module.get<CampaignController>(CampaignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
