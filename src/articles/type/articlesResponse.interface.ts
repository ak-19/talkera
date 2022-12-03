import { ArticleType } from "../type/article.type";

export interface ArticlesResponse {
    articles: ArticleType[];
    articlesCount: number;
}