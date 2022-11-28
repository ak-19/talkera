import { Body, Controller, Get, Inject, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleDTO } from './dto/article.dto';

@Controller('api/articles')
export class ArticlesController {

    constructor(private readonly articlesService: ArticlesService) { }

    @Post()
    @UsePipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true
    }))
    async create(@Body('article') body: ArticleDTO) {
        console.log(body);
        return 'creating article...'
    }

    @Get()
    async getAll(): Promise<string[]> {
        return this.articlesService.getAll();
    }


    @Get(':id')
    async getOne(@Param('id') id: number): Promise<string> {
        return this.articlesService.getOne(id);
    }

    @Put()
    async update() {
        return 'updating all articles...'
    }
}
