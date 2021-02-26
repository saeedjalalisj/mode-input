import { Test, TestingModule } from '@nestjs/testing';
import { CampaignResponseController } from './campaign-response.controller';
import { CampaignResponseService } from './campaign-response.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CampaignResponse,
  CampaignResponseSchema,
} from './entities/campaign-response.schema';
import { StatusCampaignResponseDto } from './dto/status-campaign-response.dto';
import {
  Campaigns,
  CampaignsSchema,
} from '../campaign/entities/campaign.schema';
import { TestHelpers } from '../shared/test/test.helpers';
import { CreateCampaignDto } from '../campaign/dto/create-campaign.dto';
import { CreateSiteDto } from '../site/dto/create-site.dto';
import { SiteService } from '../site/site.service';
import { CampaignService } from '../campaign/campaign.service';
import { TrackingCodeService } from '../tracking-code/tracking-code.service';
import { User, UserSchema } from '../user/entities/user.schema';
import {
  TrackingCode,
  TrackingCodeSchema,
} from '../tracking-code/entities/tracking-code.entity';
import { Site, SiteSchema } from '../site/entities/site.entity';
import { UserService } from '../user/user.service';

describe('CampaignResponseController', () => {
  let controller: CampaignResponseController;
  let testHelper: TestHelpers;
  let siteService: SiteService;
  let campaignService: CampaignService;
  let trackingCodeService: TrackingCodeService;

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
      providers: [
        CampaignResponseService,
        TestHelpers,
        UserService,
        SiteService,
        CampaignService,
        TrackingCodeService,
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
          { name: CampaignResponse.name, schema: CampaignResponseSchema },
          { name: TrackingCode.name, schema: TrackingCodeSchema },
          { name: Site.name, schema: SiteSchema },
        ]),
      ],
    }).compile();

    controller = module.get<CampaignResponseController>(
      CampaignResponseController,
    );
    testHelper = module.get<TestHelpers>(TestHelpers);
    siteService = module.get<SiteService>(SiteService);
    campaignService = module.get<CampaignService>(CampaignService);
    trackingCodeService = module.get<TrackingCodeService>(TrackingCodeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send status is answered', async () => {
    const createSiteDto: CreateSiteDto = {
      name: 'test',
      url: 'test.com',
    };
    const userId = await testHelper.creatingUser();
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

    const statusCampaignResponseDto: StatusCampaignResponseDto = {
      campId: createdCampaign._id,
      siteId: createdSite._id,
      trackingCode: createdTrackingCode.code,
    };
    const actual = await controller.status(statusCampaignResponseDto);
    expect(actual).toHaveProperty('_id');
  });
});
