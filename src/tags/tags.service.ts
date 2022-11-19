import { Injectable } from '@nestjs/common';

@Injectable()
export class TagsService {
  getAll(): string[] {
    return ['first', 'second'];
  }
}
