import { Test, TestingModule } from '@nestjs/testing';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from './entities/site.entity';
import { TestHelpers } from '../shared/test/test.helpers';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../user/entities/user.schema';

describe('SiteService', () => {
  let service: SiteService;
  let testHelper: TestHelpers;

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
      providers: [SiteService, TestHelpers, UserService],
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
          { name: Site.name, schema: SiteSchema },
          { name: User.name, schema: UserSchema },
        ]),
      ],
    }).compile();

    service = module.get<SiteService>(SiteService);
    testHelper = module.get<TestHelpers>(TestHelpers);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be created new site', async () => {
    const createdDto: CreateSiteDto = { name: 'test', url: 'test.com' };
    const userId = await testHelper.creatingUser();
    const actual = await service.create(createdDto, userId);
    expect(actual).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        url: expect.any(String),
        createdAt: expect.any(Date),
        userId: expect.any(mongoose.Types.ObjectId),
      }),
    );
  });

  it('should be find new site', async () => {
    const createdDto: CreateSiteDto = { name: 'test', url: 'test.com' };
    const userId = await testHelper.creatingUser();
    const newSite = await service.create(createdDto, userId);
    const actual = await service.findOne(newSite._id);
    expect(actual._id).toEqual(newSite._id);
  });

  it('should be find all sites', async () => {
    const userId = await testHelper.creatingUser();
    for (let i = 0; i < 5; i++) {
      const createdDto: CreateSiteDto = { name: `test${i}`, url: 'test.com' };
      await service.create(createdDto, userId);
    }
    const perPage = 2;
    const page = 1;
    const actual = await service.findAll(page, perPage, userId);
    expect(actual.length).toBe(2);
  });
});