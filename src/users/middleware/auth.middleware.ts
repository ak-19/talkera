import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { NextFunction } from 'express';
import UserRequest from '../type/userRequest.interface';
import { UsersService } from '../users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) { }

  async use(req: UserRequest, _: Response, next: NextFunction) {
    const authorization = req.headers['authorization']
    if (!authorization) {
      req.user = null;
      next()
      return;
    }

    try {
      const [_, token] = authorization.split(' ')
      const decodedUser = verify(token, process.env.SECRET);
      req.user = await this.usersService.findById(decodedUser.id)
    } catch (error) {
      req.user = null
      console.log('Error on decoding jwt token', error);
    }

    next();
  }
}
