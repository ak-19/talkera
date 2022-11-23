import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateUserDTO from './dto/CreateUserDTO';
import { User } from './entity/user.entity';
import UserResponse from './type/userResponse.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async userExists(createUserDto: CreateUserDTO): Promise<boolean> {
    const { email, username } = createUserDto;

    const userByName = await this.usersRepository.findOne({ where: { username } });
    if (userByName) return true;

    const userByEmail = await this.usersRepository.findOne({ where: { email } });
    if (userByEmail) return true;

    return false;
  }

  async createNewUser(createUserDto: CreateUserDTO): Promise<User> {
    if(await this.userExists(createUserDto)) throw new HttpException('User alreaday exists !', HttpStatus.UNPROCESSABLE_ENTITY);    
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
