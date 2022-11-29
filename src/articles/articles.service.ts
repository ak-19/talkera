import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateArticleDTO } from './dto/createArticle.dto';
import { Article } from './entity/article.entity';
import { ArticleResponse } from './type/articleResponse.interface';

@Injectable()
export class ArticlesService {
    constructor(@InjectRepository(Article) private readonly articleRepository: Repository<Article>) { }

    getAll(): Promise<Article[]> {
        return this.articleRepository.find();
    }

    private generateSlug = (prefix: string) => slugify(prefix, { lower: true }) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)

    async createArticle(currentUser: User, createArticleDto: CreateArticleDTO): Promise<Article> {
        const article = new Article();
        Object.assign(article, createArticleDto);
        if (!article.tagList) article.tagList = [];
        article.author = currentUser;
        article.slug = this.generateSlug(article.title);

        return this.articleRepository.save(article);;
    }

    getOne(id: number): Promise<Article> {
        return this.articleRepository.findOneBy({ id });
    }

    getOneBySlug(slug: string): Promise<Article> {
        return this.articleRepository.findOneBy({ slug });
    }

    buildArticleResponse(article: Article): ArticleResponse {
        return {
            article
        };
    }
}
