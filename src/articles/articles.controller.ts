import { Body, Controller, Get, Inject, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { userInfo } from 'os';
import { User as UserDecorator } from 'src/users/decorator/user.decorator';
import { User } from 'src/users/entity/user.entity';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { ArticlesService } from './articles.service';
import { CreateArticleDTO } from './dto/createArticle.dto';
import { Article } from './entity/article.entity';
import { ArticleResponse } from './type/articleResponse.interface';

@Controller('api/articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) { }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async create(@UserDecorator() currentUser: User, @Body('article') createArticleDto: CreateArticleDTO): Promise<ArticleResponse> {
        const article = await this.articlesService.createArticle(currentUser, createArticleDto)
        return this.articlesService.buildArticleResponse(article);
    }

    @Get()
    async getAll(): Promise<Article[]> {
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
