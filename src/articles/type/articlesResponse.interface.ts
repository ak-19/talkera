import { Article } from "../entity/article.entity";

export interface ArticlesResponse {
    articles: Article[];
    articlesCount: number;
}