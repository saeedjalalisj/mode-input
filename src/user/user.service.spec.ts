import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import {CreateUserDto} from "./dto/create-user.dto";
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {User, UserSchema} from "./entities/user.schema";
import * as mongoose from 'mongoose';

describe('UserService', () => {
  let service: UserService;

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
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create user', async () => {
    const createUserDto: CreateUserDto = { username: '1234', password: '123456' };
    const created = await service.create(createUserDto);
    expect(created.username).toBe(createUserDto.username);
    expect(created.password).not.toBeNull();
  })
});
