import { Test, TestingModule } from '@nestjs/testing';
import { CampaignService } from './campaign.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaigns, CampaignsSchema } from './entities/campaign.schema';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

describe('CampaignService', () => {
  let service: CampaignService;

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
      ],
    }).compile();

    service = module.get<CampaignService>(CampaignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create campaign', async () => {
    const createCampaignDto: CreateCampaignDto = {
      name: 'new_camp',
      title: 'say more?',
      subtitle: 'is that is good?',
      thanks_message: 'thanks',
      email_status: 'optional',
      full_name_status: 'optional',
      star_status: 'optional',
      description_status: 'optional',
      type: 'feedback',
    };
    const created = await service.create(createCampaignDto);
    expect(created.name).toBe(createCampaignDto.name);
  });

  it('should be find all campaign ', async () => {
    const perPage = 5;
    const page = 1;

    for (let i = 0; i <= 6; i++) {
      const createCampaignDto: CreateCampaignDto = {
        name: `new_camp${i}`,
        title: 'say more?',
        subtitle: 'is that is good?',
        thanks_message: 'thanks',
        email_status: 'optional',
        full_name_status: 'optional',
        star_status: 'optional',
        description_status: 'optional',
        type: 'feedback',
      };
      await service.create(createCampaignDto);
    }
    const result = await service.findAll(page, perPage);
    expect(result.length).toBe(5);
  });

  it('should find campaign with id', async () => {
    const createCampaignDto: CreateCampaignDto = {
      name: `new_camp`,
      title: 'say more?',
      subtitle: 'is that is good?',
      thanks_message: 'thanks',
      email_status: 'optional',
      full_name_status: 'optional',
      star_status: 'optional',
      description_status: 'optional',
      type: 'feedback',
    };

    const created = await service.create(createCampaignDto);
    const result = await service.findOne(created.id);
    expect(result.name).toBe(createCampaignDto.name);
  });

  it('should be update campaign ', async () => {
    const createCampaignDto: CreateCampaignDto = {
      name: `new_camp`,
      title: 'say more?',
      subtitle: 'is that is good?',
      thanks_message: 'thanks',
      email_status: 'optional',
      full_name_status: 'optional',
      star_status: 'optional',
      description_status: 'optional',
      type: 'feedback',
    };

    const created = await service.create(createCampaignDto);

    const updateCampaignDto: UpdateCampaignDto = {
      name: `new_camp1`,
      title: 'say more?',
      subtitle: 'is that is good?',
      thanks_message: 'thanks',
      full_name_status: 'optional',
      email_status: 'optional',
      star_status: 'optional',
      description_status: 'optional',
      type: 'feedback',
    };
    await service.update(created.id, updateCampaignDto);
    const result = await service.findOne(created.id);
    expect(result.name).toBe(updateCampaignDto.name);
  });
});
