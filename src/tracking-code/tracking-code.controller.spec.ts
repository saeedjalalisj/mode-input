import { Test, TestingModule } from '@nestjs/testing';
import { TrackingCodeController } from './tracking-code.controller';
import { TrackingCodeService } from './tracking-code.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TrackingCode,
  TrackingCodeSchema,
} from './entities/tracking-code.entity';

describe('TrackingCodeController', () => {
  let controller: TrackingCodeController;

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
          { name: TrackingCode.name, schema: TrackingCodeSchema },
        ]),
      ],
      controllers: [TrackingCodeController],
      providers: [TrackingCodeService],
    }).compile();

    controller = module.get<TrackingCodeController>(TrackingCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be create tracking code for tracking new anonymous user', async () => {
    const actual = await controller.create();
    expect(actual).toHaveProperty('code');
  });
});
