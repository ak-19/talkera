import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import { User as UserDecorator } from 'src/users/decorator/user.decorator';
import { User } from 'src/users/entity/user.entity';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { DeleteResult } from 'typeorm';
import { ArticlesService } from './articles.service';
import { CreateArticleDTO } from './dto/createArticle.dto';
import { UpdateArticleDTO } from './dto/updateArticle.dto';
import { ArticleResponse } from './type/articleResponse.interface';
import { ArticlesResponse } from './type/articlesResponse.interface';

@Controller('api/articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) { }

    @Get()
    async getAll(@UserDecorator('id') currentUserId: number, @Query() queryParameters: any): Promise<ArticlesResponse> {
        return this.articlesService.getAll(currentUserId, queryParameters);
    }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async create(@UserDecorator() currentUser: User, @Body('article') createArticleDto: CreateArticleDTO): Promise<ArticleResponse> {
        const article = await this.articlesService.createArticle(currentUser, createArticleDto)
        return this.articlesService.buildArticleResponse(article);
    }

    @Get('slug/:slug')
    async getBySlug(@Param('slug') slug: string): Promise<ArticleResponse> {
        const article = await this.articlesService.getOneBySlug(slug);
        if (!article) throw new HttpException('Article with that slug not found', HttpStatus.NOT_FOUND);
        return this.articlesService.buildArticleResponse(article);
    }

    @Delete(':slug')
    @UseGuards(AuthGuard)
    async deleteBySlug(@UserDecorator('id') currentUserId: number, @Param('slug') slug: string): Promise<DeleteResult> {
        return await this.articlesService.deleteBySlug(currentUserId, slug);
    }

    @Put(':slug')
    @UseGuards(AuthGuard)
    async updateArticle(@UserDecorator('id') currentUserId: number, @Param('slug') slug: string, @Body('article') updateArticleDTO: UpdateArticleDTO): Promise<ArticleResponse> {
        const article = await this.articlesService.updateBySlug(currentUserId, slug, updateArticleDTO);
        return this.articlesService.buildArticleResponse(article);
    }

    @Post(':slug/favorite')
    @UseGuards(AuthGuard)
    async favoriteArticle(@UserDecorator('id') currentUserId: number, @Param('slug') slug: string): Promise<ArticleResponse> {
        const article = await this.articlesService.addArticleToFavorites(currentUserId, slug);
        return this.articlesService.buildArticleResponse(article);
    }

    @Delete(':slug/favorite')
    @UseGuards(AuthGuard)
    async unfavoriteArticle(@UserDecorator('id') currentUserId: number, @Param('slug') slug: string): Promise<ArticleResponse> {
        const article = await this.articlesService.removeArticleFromFavorites(currentUserId, slug);
        return this.articlesService.buildArticleResponse(article);
    }
}
