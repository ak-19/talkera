import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User as UserDecorator } from './decorator/user.decorator';
import CreateUserDTO from './dto/createUser.dto';
import LoginUserDTO from './dto/loginUser.dto';
import UpdateUserDTO from './dto/updateUser.dto';
import { User } from './entity/user.entity';
import { AuthGuard } from './guards/auth.guard';
import UserRequest from './type/userRequest.interface';
import UserResponse from './type/userResponse.interface';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

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

  @Get()
  @UseGuards(AuthGuard)
  async getUser(@UserDecorator() user: User): Promise<UserResponse> {
    return this.usersService.buildUserResponse(user);
  }

  @Put()
  @UseGuards(AuthGuard)
  @UsePipes(
    new ValidationPipe(),
  )
  async updateUser(
    @UserDecorator('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDTO
  ): Promise<UserResponse> {
    const user = await this.usersService.updateUser(currentUserId, updateUserDto);
    return this.usersService.buildUserResponse(user);
  }
}
