import { Test, TestingModule } from '@nestjs/testing';
import { CampaignService } from './campaign.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaigns, CampaignsSchema } from './entities/campaign.schema';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
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

describe('CampaignService', () => {
  let service: CampaignService;
  let userService: UserService;

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
      providers: [CampaignService, UserService],
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
          { name: User.name, schema: UserSchema}
        ]),
      ],
    }).compile();

    service = module.get<CampaignService>(CampaignService);
    userService = module.get<UserService>(UserService);
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
      allow_rating: true,
      require_rating: true,
      allow_full_name: false,
      allow_mobile: false,
      allow_comment: false,
      allow_email: false,
      type: 'feedback'
    };
    const userId = await createUser(userService);
    const created = await service.create(createCampaignDto, userId);
    expect(created.name).toBe(createCampaignDto.name);
  });

  it('should be find all campaign ', async () => {
    const perPage = 5;
    const page = 1;
    const userId = await createUser(userService);
    for (let i = 0; i <= 6; i++) {
      const createCampaignDto: CreateCampaignDto = {
        name: `new_camp${i}`,
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
      await service.create(createCampaignDto, userId);
    }
    const result = await service.findAll(page, perPage, userId);
    expect(result.length).toBe(5);
  });

  it('should find campaign with id', async () => {
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
    const created = await service.create(createCampaignDto, userId);
    const result = await service.findOne(created.id, userId);
    expect(result.name).toBe(createCampaignDto.name);
  });

  it('should be update campaign ', async () => {
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
    const created = await service.create(createCampaignDto, userId);

    const updateCampaignDto: UpdateCampaignDto = {
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
    await service.update(created.id, updateCampaignDto, userId);
    const result = await service.findOne(created.id, userId);
    expect(result.name).toBe(updateCampaignDto.name);
  });

  it('should be remove campaign', () => {
    //todo: user can remove own campaign
  });
});
