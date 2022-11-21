import { Controller, Inject, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createNewUser(): Promise<any> {
    return this.usersService.createNewUser();
  }
}
