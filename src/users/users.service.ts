import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async createNewUser(): Promise<any> {
    return { stub: 'To - do' };
  }
}
