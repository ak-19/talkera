import { Article } from '../entity/article.entity';

export type ArticleType = Omit<Article, 'updateTimeStamp'>;