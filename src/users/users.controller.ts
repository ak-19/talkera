import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import CreateUserDTO from './dto/createUser.dto';
import LoginUserDTO from './dto/loginUser.dto';
import { User } from './entity/user.entity';
import UserResponse from './type/userResponse.interface';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async createNewUser(
    @Body('user') createUserDto: CreateUserDTO,
  ): Promise<UserResponse> {
    const user = await this.usersService.createNewUser(createUserDto);
    return this.usersService.buildUserResponse(user);
  }

  @Post('login')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async login(@Body('user') loginUserDto: LoginUserDTO): Promise<UserResponse> {
    const user = await this.usersService.verifyAndGetUser(loginUserDto);
    return this.usersService.buildUserResponse(user);
  }
}
