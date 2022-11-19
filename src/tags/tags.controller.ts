import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('api/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  getAll(): string[] {
    return this.tagsService.getAll();
  }
}
