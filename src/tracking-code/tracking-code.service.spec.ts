import { Test, TestingModule } from '@nestjs/testing';
import { TrackingCodeService } from './tracking-code.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackingCode, TrackingCodeSchema } from './entities/tracking-code.entity';

describe('TrackingCodeService', () => {
  let service: TrackingCodeService;

  let mongod: MongoMemoryServer = new MongoMemoryServer({
    autoStart: true,
  })

  afterEach(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  })

  beforeEach(async () => {
    mongod = new MongoMemoryServer();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: await mongod.getUri(),
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
          }),
        }),
        MongooseModule.forFeature([{ name: TrackingCode.name, schema: TrackingCodeSchema }])
      ],
      providers: [TrackingCodeService],
    }).compile();

    service = module.get<TrackingCodeService>(TrackingCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create tracking code', async () => {
    expect(await service.create()).not.toBeNull();
  });
});
