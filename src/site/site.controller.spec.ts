import { Test, TestingModule } from '@nestjs/testing';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from './entities/site.entity';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { TestHelpers } from '../shared/test/test.helpers';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../user/entities/user.schema';
import { PaginationDto } from '../shared/pagination.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

describe('SiteController', () => {
  let controller: SiteController;
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
      controllers: [SiteController],
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
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (ctx: ExecutionContext) => {
          const request = ctx.switchToHttp().getRequest();
          request.user = { userId: 'abc123' };
          return true;
        },
      })
      .compile();

    controller = module.get<SiteController>(SiteController);
    testHelper = module.get<TestHelpers>(TestHelpers);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be create site', async () => {
    const createdDto: CreateSiteDto = { name: 'test', url: 'test.com' };
    const userId = await testHelper.creatingUser();
    const currentUser = { userId };
    const actual = await controller.create(createdDto, currentUser);
    expect(actual).toMatchObject({
      name: expect.any(String),
      url: expect.any(String),
    });
  });

  it('should be find one site', async () => {
    const createdDto: CreateSiteDto = { name: 'test', url: 'test.com' };
    const userId = await testHelper.creatingUser();
    const currentUser = { userId };
    const newSite = await controller.create(createdDto, currentUser);
    expect(await controller.findOne(newSite.id)).toMatchObject({
      name: expect.any(String),
      url: expect.any(String),
    });
  });

  it('should be find all site', async () => {
    const userId = await testHelper.creatingUser();
    const currentUser = { userId };
    for (let i = 1; i <= 5; i++) {
      const createdDto: CreateSiteDto = { name: `test${i}`, url: 'test.com' };
      await controller.create(createdDto, currentUser);
    }
    const query: PaginationDto = {
      perPage: 2,
      page: 1,
    };
    const actual = await controller.findAll(query, currentUser);
    expect(actual.length).toBe(2);
  });

  it('should be update site ', async () => {
    const userId = await testHelper.creatingUser();
    const currentUser = { userId };
    const createdDto: CreateSiteDto = { name: 'test', url: 'test.com' };
    const createdSite = await controller.create(createdDto, currentUser);
    const updateSiteDto: UpdateSiteDto = { name: 'test1', url: 'test1.com' };
    const actual = await controller.update(
      createdSite.id,
      updateSiteDto,
      currentUser,
    );
    expect(actual.ok).toBe(1);
  });
});
