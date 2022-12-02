import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { User } from 'src/users/entity/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateArticleDTO } from './dto/createArticle.dto';
import { UpdateArticleDTO } from './dto/updateArticle.dto';
import { Article } from './entity/article.entity';
import { ArticleResponse } from './type/articleResponse.interface';
import { ArticlesResponse } from './type/articlesResponse.interface';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }

    async getAll(currentUserId: number, queryParameters: any): Promise<Promise<ArticlesResponse>> {
        const { limit, offset, tag, author } = queryParameters;
        const queryBuilder = this.articleRepository
            .createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author')
            .orderBy('articles.creatdAt', 'DESC')

        if (author) {
            const authorUser = await this.userRepository.findOneBy({ username: author })
            queryBuilder.andWhere('articles.author = :id', { id: authorUser.id })
        }
        if (tag) queryBuilder.andWhere('articles.tagList LIKE :tag', { tag: `%${tag}%` })
        if (offset) queryBuilder.offset(offset - 1);
        if (limit) queryBuilder.limit(limit);

        const articles = await queryBuilder.getMany();
        const articlesCount = await queryBuilder.getCount();

        return {
            articles,
            articlesCount
        };
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

    async deleteBySlug(currentUserId: number, slug: string): Promise<DeleteResult> {
        const article = await this.articleRepository.findOneBy({ slug });

        if (!article) throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
        if (currentUserId !== article.author.id) throw new HttpException('You are not allowed to delete this article', HttpStatus.FORBIDDEN);

        return this.articleRepository.delete({ slug })
    }

    async updateBySlug(currentUserId: number, slug: string, updateArticleDTO: UpdateArticleDTO) {
        const article = await this.articleRepository.findOneBy({ slug });

        if (!article) throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
        if (article.author.id != currentUserId) throw new HttpException('Not allowed to update article', HttpStatus.NOT_FOUND);

        Object.assign(article, updateArticleDTO);

        await this.articleRepository.save(article)

        return article;
    }

    async addArticleToFavorites(currentUserId: number, slug: string): Promise<Article> {
        const article = await this.articleRepository.findOneBy({ slug });
        if (!article) throw new HttpException('Article not found', HttpStatus.NOT_FOUND);

        const user = await this.userRepository.findOne({ where: { id: currentUserId }, relations: ['favorites'] });

        if (user.favorites.findIndex(a => a.id === article.id) === -1) {
            user.favorites.push(article);
            article.favoritesCount++;
            await this.userRepository.save(user)
            await this.articleRepository.save(article)
        } else {
            console.log('Article already favorited by this user');
        }

        return article
    }

    async removeArticleFromFavorites(currentUserId: number, slug: string): Promise<Article> {
        const article = await this.articleRepository.findOneBy({ slug });
        if (!article) throw new HttpException('Article not found', HttpStatus.NOT_FOUND);

        console.log('un liking it -- TODO');

        return article
    }
}

