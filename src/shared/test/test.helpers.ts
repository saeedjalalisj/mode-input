import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { user } from './user.mock';

@Injectable()
export class TestHelpers {
  constructor(private userService: UserService) {}

  async creatingUser() {
    const newUser = await this.userService.create(user);
    return newUser.id;
  }
}
