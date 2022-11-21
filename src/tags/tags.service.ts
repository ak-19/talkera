import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Tags } from './tags.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tags)
    private readonly coffeeRepository: Repository<Tags>,
    private readonly connection: Connection,
  ) {}

  async getAll(): Promise<{ tags: string[] }> {
    const tags = await this.coffeeRepository.find();
    return { tags: tags.map((tag) => tag.name) };
  }
}
