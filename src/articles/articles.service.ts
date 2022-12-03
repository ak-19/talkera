import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { User } from 'src/users/entity/user.entity';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
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

    private async trySetAuthorFilter(author: string, queryBuilder: SelectQueryBuilder<Article>): Promise<void> {
        if (author) {
            const authorUser = await this.userRepository.findOneBy({ username: author })
            queryBuilder.andWhere('articles.author = :id', { id: authorUser.id })
        }
    }

    private async trySetFavoritedFilter(favorited: string, queryBuilder: SelectQueryBuilder<Article>): Promise<void> {
        if (favorited) {
            const favoritedUser = await this.userRepository.findOne({ where: { username: favorited }, relations: ['favorites'] });
            const ids = favoritedUser.favorites.map(article => article.id);
            if (ids.length > 0) {
                queryBuilder.andWhere('articles.id IN (:...ids)', { ids })
            } else {
                queryBuilder.andWhere('1=0')
            }
        }
    }

    private async articlesWithFavorites(currentUserId: number, articles: Article[]) {
        let favoritedIds = [];

        if (currentUserId) {
            const currentUser = await this.userRepository.findOne({ where: { id: currentUserId }, relations: ['favorites'] })
            favoritedIds = currentUser.favorites.map(a => a.id);
        }

        return articles.map(article => {
            const favorited = favoritedIds.includes(article.id)
            return { ...article, favorited };
        })
    }

    async getAll(currentUserId: number, queryParameters: any): Promise<ArticlesResponse> {
        const { limit, offset, tag, author, favorited } = queryParameters;
        const queryBuilder = this.articleRepository
            .createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author')
            .orderBy('articles.creatdAt', 'DESC')

        await this.trySetAuthorFilter(author, queryBuilder);

        await this.trySetFavoritedFilter(favorited, queryBuilder);

        if (tag) queryBuilder.andWhere('articles.tagList LIKE :tag', { tag: `%${tag}%` })
        if (offset) queryBuilder.offset(offset - 1);
        if (limit) queryBuilder.limit(limit);

        const articles = await queryBuilder.getMany();

        const articlesCount = await queryBuilder.getCount();
        const articlesWithFavorited = await this.articlesWithFavorites(currentUserId, articles);

        return {
            articles: articlesWithFavorited,
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
            await this.userRepository.save(user);
            await this.articleRepository.save(article);
        } else {
            console.log('Article already favorited by this user');
        }

        return article;
    }

    async removeArticleFromFavorites(currentUserId: number, slug: string): Promise<Article> {
        const article = await this.articleRepository.findOneBy({ slug });
        if (!article) throw new HttpException('Article not found', HttpStatus.NOT_FOUND);

        const user = await this.userRepository.findOne({ where: { id: currentUserId }, relations: ['favorites'] });
        const index = user.favorites.findIndex(a => a.id === article.id);
        if (index !== -1) {
            user.favorites.splice(index, 1);
            article.favoritesCount--;
            await this.userRepository.save(user);
            await this.articleRepository.save(article);
        } else {
            console.log('Article is not favorited');
        }

        return article;
    }
}

