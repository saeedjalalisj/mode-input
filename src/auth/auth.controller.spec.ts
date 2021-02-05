import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from "mongoose";
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/entities/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

describe('AuthController', () => {
  let controller: AuthController;

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
      controllers: [AuthController],
      providers: [AuthService, UserService, LocalStrategy, JwtStrategy],
      imports:[
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secretOrPrivateKey: 'secretKey',
          signOptions: {
            expiresIn: 3600,
          },
        }),
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: await mongod.getUri(),
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
          }),
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
