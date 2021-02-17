import { Test, TestingModule } from '@nestjs/testing';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from './entities/site.entity';

describe('SiteController', () => {
  let controller: SiteController;

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
      providers: [SiteService],
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: await mongod.getUri(),
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
          }),
        }),
        MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }]),
      ],
    }).compile();

    controller = module.get<SiteController>(SiteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be create site', async () => {
    const createdDto: CreateSiteDto = { name: 'test', url: 'test.com' };
    const actual = await controller.create(createdDto);
    expect(actual).toMatchObject({
      name: expect.any(String),
      url: expect.any(String),
    });
  });
});
