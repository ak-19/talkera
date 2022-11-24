import * as jwt from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateUserDTO from './dto/createUser.dto';
import { User } from './entity/user.entity';
import UserResponse from './type/userResponse.interface';
import LoginUserDTO from './dto/loginUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async verifyAndGetUser(loginteUserDto: LoginUserDTO): Promise<User> {
    const { email, password } = loginteUserDto;

    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'password', 'bio', 'image'],
    });

    if (!user)
      throw new HttpException(
        'User does not exists !',
        HttpStatus.UNAUTHORIZED,
      );

    if (!(await compare(password, user.password)))
      throw new HttpException('User password invalid', HttpStatus.UNAUTHORIZED);

    delete user.password;

    return user;
  }

  async findById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async userExists(createUserDto: CreateUserDTO): Promise<boolean> {
    const { email, username } = createUserDto;

    const userByName = await this.usersRepository.findOne({
      where: { username },
    });
    if (userByName) return true;

    const userByEmail = await this.usersRepository.findOne({
      where: { email },
    });
    if (userByEmail) return true;

    return false;
  }

  async createNewUser(createUserDto: CreateUserDTO): Promise<User> {
    if (await this.userExists(createUserDto))
      throw new HttpException(
        'Email or username alreaday exists !',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    const newUser = new User();
    Object.assign(newUser, createUserDto);
    return this.usersRepository.save(newUser);
  }

  generateJwt(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.SECRET,
    );
  }

  buildUserResponse(user: User): UserResponse {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
