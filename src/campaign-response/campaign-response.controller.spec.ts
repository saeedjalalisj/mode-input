import { Test, TestingModule } from '@nestjs/testing';
import { CampaignResponseController } from './campaign-response.controller';
import { CampaignResponseService } from './campaign-response.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from "mongoose";
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignResponse, CampaignResponseSchema } from './entities/campaign-response.schema';

describe('CampaignResponseController', () => {
  let controller: CampaignResponseController;

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
      controllers: [CampaignResponseController],
      providers: [CampaignResponseService],
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: await mongod.getUri(),
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
          }),
        }),
        MongooseModule.forFeature([{ name: CampaignResponse.name, schema: CampaignResponseSchema }]),
      ]
    }).compile();

    controller = module.get<CampaignResponseController>(CampaignResponseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
