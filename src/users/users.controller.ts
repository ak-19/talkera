import { Body, Controller, Inject, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import CreateUserDTO from './dto/CreateUserDTO';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createNewUser(@Body('user') createUserDto: CreateUserDTO): Promise<any> {
    const user = await this.usersService.createNewUser(createUserDto);
    return this.usersService.buildUserResponse(user);
  }
}
