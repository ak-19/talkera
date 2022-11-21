import { Controller, Get } from '@nestjs/common';
import { Tags } from './tags.entity';
import { TagsService } from './tags.service';

@Controller('api/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  getAll(): Promise<{ tags: string[] }> {
    return this.tagsService.getAll();
  }
}
