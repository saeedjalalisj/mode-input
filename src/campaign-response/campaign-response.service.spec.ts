import { Test, TestingModule } from '@nestjs/testing';
import { CampaignResponseService } from './campaign-response.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignResponse, CampaignResponseSchema } from './entities/campaign-response.schema';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateCampaignDto } from '../campaign/dto/create-campaign.dto';
import { CampaignService } from '../campaign/campaign.service';
import { UserService } from '../user/user.service';
import { CreateCampaignResponseDto } from './dto/create-campaign-response.dto';
import { CreateCampaignResponseInterface } from './interface/create-campaign-response.interface';
import { Campaigns, CampaignsSchema } from '../campaign/entities/campaign.schema';
import { User, UserSchema } from '../user/entities/user.schema';

async function createUser (userService) {
  const mockUser: CreateUserDto = {
    username: 's1',
    password: '1234',
    email: 'test@gmail.com',
    name: 's',
    family: 'j'
  };
  const user = await userService.create(mockUser);
  return user.id
}


describe('CampaignResponseService', () => {
  let service: CampaignResponseService;
  let userService: UserService;
  let campaignService: CampaignService;

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
      providers: [CampaignResponseService, CampaignService, UserService],
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
          { name: User.name, schema: UserSchema},
          { name: CampaignResponse.name, schema: CampaignResponseSchema }
        ])
      ]
    }).compile();

    service = module.get<CampaignResponseService>(CampaignResponseService);
    userService = module.get<UserService>(UserService);
    campaignService = module.get<CampaignService>(CampaignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create response of a campaign', async () => {
    const createCampaignDto: CreateCampaignDto = {
      name: 'new_camp',
      title: 'say more?',
      subtitle: 'is that is good?',
      thanks_message: 'thanks',
      allow_rating: true,
      require_rating: true,
      allow_full_name: false,
      allow_mobile: false,
      allow_comment: false,
      allow_email: false,
      type: 'feedback'
    };
    const userId = await createUser(userService);
    const createdCampaign = await campaignService.create(createCampaignDto, userId);
    const createCampaignResponseDto: CreateCampaignResponseDto = {
      star: '1',
      email: 'saeed@test.com',
      full_name: 'test tester',
      description: 'so good'
    };

    const campResp: CreateCampaignResponseInterface = {
      campId: createdCampaign.id,
      ...createCampaignResponseDto
    }

    const created = await service.create(campResp);
    expect(created.star).toBe('1');
  });

  it('should be find all ', async () => {
    // user can see only own response and campaigns
    const createCampaignDto: CreateCampaignDto = {
      name: 'new_camp',
      title: 'say more?',
      subtitle: 'is that is good?',
      thanks_message: 'thanks',
      allow_rating: true,
      require_rating: true,
      allow_full_name: false,
      allow_mobile: false,
      allow_comment: false,
      allow_email: false,
      type: 'feedback'
    };
    const userId = await createUser(userService);
    const createdCampaign = await campaignService.create(createCampaignDto, userId);

    for (let i = 0; i <= 5; i++) {
      const createCampaignResponseDto: CreateCampaignResponseDto = {
        star: `${i}`,
        email: 'saeed@test.com',
        full_name: 'test tester',
        description: 'so good'
      };

      const campResp: CreateCampaignResponseInterface = {
        campId: createdCampaign.id,
        ...createCampaignResponseDto
      }

      await service.create(campResp);
    }
    const result = await service.findAll(createdCampaign.id, userId, 1, 3);
    expect(result.length).toBe(3);

  });

  it('find all return no result ', async () => {
    // user can see only own response and campaigns
    const createCampaignDto: CreateCampaignDto = {
      name: 'new_camp',
      title: 'say more?',
      subtitle: 'is that is good?',
      thanks_message: 'thanks',
      allow_rating: true,
      require_rating: true,
      allow_full_name: false,
      allow_mobile: false,
      allow_comment: false,
      allow_email: false,
      type: 'feedback'
    };
    const userId = await createUser(userService);
    const createdCampaign = await campaignService.create(createCampaignDto, userId);

    const result = await service.findAll(createdCampaign.id, userId, 1, 3);
    expect(result.length).toBe(0);
  });

  it('should findOne return one document', async () => {
    const createCampaignDto: CreateCampaignDto = {
      name: 'new_camp',
      title: 'say more?',
      subtitle: 'is that is good?',
      thanks_message: 'thanks',
      allow_rating: true,
      require_rating: true,
      allow_full_name: false,
      allow_mobile: false,
      allow_comment: false,
      allow_email: false,
      type: 'feedback'
    };
    const userId = await createUser(userService);
    const createdCampaign = await campaignService.create(createCampaignDto, userId);

    const createCampaignResponseDto: CreateCampaignResponseDto = {
      star: '1',
      email: 'saeed@test.com',
      full_name: 'test tester',
      description: 'so good'
    };

    const campResp: CreateCampaignResponseInterface = {
      campId: createdCampaign.id,
      ...createCampaignResponseDto
    }

    const created = await service.create(campResp);
    const result = await service.findOne(created.id);
    expect(result.star).toBe('1');
  });

});
