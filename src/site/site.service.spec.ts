import { Test, TestingModule } from '@nestjs/testing';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from './entities/site.entity';

describe('SiteService', () => {
  let service: SiteService;

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

    service = module.get<SiteService>(SiteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be created new site', async () => {
    const createdDto: CreateSiteDto = { name: 'test', url: 'test.com' };
    const actual = await service.create(createdDto);
    expect(actual).toHaveProperty('name');
    expect(actual).toHaveProperty('url');
  });
});
