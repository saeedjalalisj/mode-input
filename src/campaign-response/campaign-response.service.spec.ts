import { Test, TestingModule } from '@nestjs/testing';
import { CampaignResponseService } from './campaign-response.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CampaignResponse,
  CampaignResponseEntity,
} from './entities/campaign-response.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateCampaignDto } from '../campaign/dto/create-campaign.dto';
import { CampaignService } from '../campaign/campaign.service';
import { UserService } from '../user/user.service';
import { CreateCampaignResponseDto } from './dto/create-campaign-response.dto';
import { CreateCampaignResponseInterface } from './interface/create-campaign-response.interface';
import {
  Campaigns,
  CampaignsSchema,
} from '../campaign/entities/campaign.schema';
import { User, UserSchema } from '../user/entities/user.schema';
import { TrackingCodeService } from '../tracking-code/tracking-code.service';
import {
  TrackingCode,
  TrackingCodeSchema,
} from '../tracking-code/entities/tracking-code.entity';
import { StatusCampaignResponseDto } from './dto/status-campaign-response.dto';
import { CreateSiteDto } from '../site/dto/create-site.dto';
import { Site, SiteSchema } from '../site/entities/site.entity';
import { SiteService } from '../site/site.service';

async function createUser(userService) {
  const mockUser: CreateUserDto = {
    username: 's1',
    password: '1234',
    email: 'test@gmail.com',
    name: 's',
    family: 'j',
  };
  const user = await userService.create(mockUser);
  return user.id;
}

describe('CampaignResponseService', () => {
  let service: CampaignResponseService;
  let userService: UserService;
  let campaignService: CampaignService;
  let trackingCodeService: TrackingCodeService;
  let siteService: SiteService;

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
      providers: [
        CampaignResponseService,
        CampaignService,
        UserService,
        TrackingCodeService,
        SiteService,
      ],
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
          { name: User.name, schema: UserSchema },
          { name: CampaignResponse.name, schema: CampaignResponseEntity },
          { name: TrackingCode.name, schema: TrackingCodeSchema },
          { name: Site.name, schema: SiteSchema },
        ]),
      ],
    }).compile();

    service = module.get<CampaignResponseService>(CampaignResponseService);
    userService = module.get<UserService>(UserService);
    campaignService = module.get<CampaignService>(CampaignService);
    trackingCodeService = module.get<TrackingCodeService>(TrackingCodeService);
    siteService = module.get<SiteService>(SiteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create response of a campaign', async () => {
    const createSiteDto: CreateSiteDto = {
      name: 'test',
      url: 'test.com',
    };

    const userId = await createUser(userService);
    const createdSite = await siteService.create(createSiteDto, userId);

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
      type: 'feedback',
      siteId: createdSite._id,
    };

    const createdCampaign = await campaignService.create(
      createCampaignDto,
      userId,
    );
    const createdTrackingCode = await trackingCodeService.create();
    const createCampaignResponseDto: CreateCampaignResponseDto = {
      rate: '1',
      email: 'saeed@test.com',
      full_name: 'test tester',
      comment: 'so good',
      trackingId: createdTrackingCode._id,
    };

    const campResp: CreateCampaignResponseInterface = {
      campId: createdCampaign.id,
      ...createCampaignResponseDto,
    };

    const created = await service.create(campResp);
    expect(created.rate).toBe('1');
  });

  it('should be find all ', async () => {
    const createSiteDto: CreateSiteDto = {
      name: 'test',
      url: 'test.com',
    };

    const userId = await createUser(userService);
    const createdSite = await siteService.create(createSiteDto, userId);
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
      type: 'feedback',
      siteId: createdSite._id,
    };

    const createdCampaign = await campaignService.create(
      createCampaignDto,
      userId,
    );

    for (let i = 0; i <= 5; i++) {
      const createdTrackingCode = await trackingCodeService.create();
      const createCampaignResponseDto: CreateCampaignResponseDto = {
        rate: `${i}`,
        email: 'saeed@test.com',
        full_name: 'test tester',
        comment: 'so good',
        trackingId: createdTrackingCode._id,
      };

      const campResp: CreateCampaignResponseInterface = {
        campId: createdCampaign.id,
        ...createCampaignResponseDto,
      };

      await service.create(campResp);
    }
    const result = await service.findAll(createdCampaign.id, userId, 1, 3);
    expect(result.length).toBe(3);
  });

  it('find all return no result ', async () => {
    const createSiteDto: CreateSiteDto = {
      name: 'test',
      url: 'test.com',
    };

    const userId = await createUser(userService);
    const createdSite = await siteService.create(createSiteDto, userId);

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
      type: 'feedback',
      siteId: createdSite._id,
    };

    const createdCampaign = await campaignService.create(
      createCampaignDto,
      userId,
    );

    const result = await service.findAll(createdCampaign.id, userId, 1, 3);
    expect(result.length).toBe(0);
  });

  it('should findOne return one document', async () => {
    const createSiteDto: CreateSiteDto = {
      name: 'test',
      url: 'test.com',
    };

    const userId = await createUser(userService);
    const createdSite = await siteService.create(createSiteDto, userId);
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
      type: 'feedback',
      siteId: createdSite._id,
    };

    const createdCampaign = await campaignService.create(
      createCampaignDto,
      userId,
    );

    const createdTrackingCode = await trackingCodeService.create();
    const createCampaignResponseDto: CreateCampaignResponseDto = {
      rate: '1',
      email: 'saeed@test.com',
      full_name: 'test tester',
      comment: 'so good',
      trackingId: createdTrackingCode._id,
    };

    const campResp: CreateCampaignResponseInterface = {
      campId: createdCampaign.id,
      ...createCampaignResponseDto,
    };

    const created = await service.create(campResp);
    const result = await service.findOne(created.id);
    expect(result.rate).toBe('1');
  });

  it('should be return campaign must be answered', async () => {
    const createSiteDto: CreateSiteDto = {
      name: 'test',
      url: 'test.com',
    };
    const userId = await createUser(userService);
    const createdSite = await siteService.create(createSiteDto, userId);
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
      type: 'feedback',
      siteId: createdSite._id,
    };
    const createdCampaign = await campaignService.create(
      createCampaignDto,
      userId,
    );
    const createdTrackingCode = await trackingCodeService.create();
    const createCampaignResponseDto: CreateCampaignResponseDto = {
      rate: '1',
      email: 'saeed@test.com',
      full_name: 'test tester',
      comment: 'so good',
      trackingId: createdTrackingCode._id,
    };
    const campResp: CreateCampaignResponseInterface = {
      campId: createdCampaign.id,
      ...createCampaignResponseDto,
    };
    await service.create(campResp);
    const statusDto: StatusCampaignResponseDto = {
      campId: createdCampaign.id,
      trackingCode: createdTrackingCode.code,
      siteId: createdSite._id,
    };
    await expect(service.status(statusDto)).rejects.toThrow();
  });

  it('should be show campaign data to client', async () => {
    const createSiteDto: CreateSiteDto = {
      name: 'test',
      url: 'test.com',
    };
    const userId = await createUser(userService);
    const createdSite = await siteService.create(createSiteDto, userId);
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
      type: 'feedback',
      siteId: createdSite._id,
    };
    const createdCampaign = await campaignService.create(
      createCampaignDto,
      userId,
    );
    const createdTrackingCode = await trackingCodeService.create();
    const statusDto: StatusCampaignResponseDto = {
      campId: createdCampaign.id,
      trackingCode: createdTrackingCode.code,
      siteId: createdSite._id,
    };
    const actual = await service.status(statusDto);
    const expected = {
      allow_comment: expect.any(Boolean),
      allow_email: expect.any(Boolean),
      allow_full_name: expect.any(Boolean),
      allow_mobile: expect.any(Boolean),
      allow_rating: expect.any(Boolean),
      name: expect.any(String),
      require_comment: expect.any(Boolean),
      require_email: expect.any(Boolean),
      require_full_name: expect.any(Boolean),
      require_mobile: expect.any(Boolean),
      require_rating: expect.any(Boolean),
      show_thanks_message: expect.any(Boolean),
      subtitle: expect.any(String),
      thanks_message: expect.any(String),
      title: expect.any(String),
      type: expect.any(String),
      _id: expect.any(mongoose.Types.ObjectId),
    };
    expect(actual).toMatchObject(expected);
  });
});
