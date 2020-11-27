import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../user/interfaces/user.interface'
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {jwtConstants} from "./auth.constants";
import {IPayload} from "./auth.interface";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}
  async validateUser(user: User): Promise<any> {
    console.log(user);
    const findUser = await this.userService.findByUsername(user.username);
    if (findUser && (await bcrypt.compare(user.password, findUser.password))) {
      const { password, ...result } = findUser;
      return result;
    }
    return null;
  }

  async register(user: User) {
    try {
      const userCreated = await this.userService.create(user);
      if (!userCreated) {
        return new HttpException('user can not created', HttpStatus.CONFLICT)
      }
      const payload = {
        username: userCreated.username,
        sub: userCreated._id,
      };
      return {
        access_token: this.createToken(payload),
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async login(user: User) {
    const findUser = await this.userService.findByUsername(user.username);
    if (!findUser) {
      throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
    }
    const payload = {username: findUser.username, sub: findUser.id};
    return {
      access_token: this.createToken(payload),
    };
  }

  createToken(payload: IPayload) {
    try {
      return this.jwtService.sign(payload, {
        expiresIn: parseInt(jwtConstants.expiresIn, 10),
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
