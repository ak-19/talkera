import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateUserDTO from './dto/CreateUserDTO';
import { User } from './entity/user.entity';
import { isErrored } from 'stream';
import UserResponse from './type/userResponse.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createNewUser(createUserDto: CreateUserDTO): Promise<User> {
    const newUser = new User();    
    Object.assign(newUser, createUserDto);    
    return this.usersRepository.save(newUser);
  }

  generateJwt(user: User): string{
    return jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email
    }, process.env.SECRET)
  }

  buildUserResponse(user: User): UserResponse { 
    return {
      user: {
        ...user,
        token: this.generateJwt(user)
      }

    }
  }
}
