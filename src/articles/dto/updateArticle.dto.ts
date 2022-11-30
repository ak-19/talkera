import { IsNotEmpty, IsString } from "class-validator";

export class UpdateArticleDTO {
    readonly title: string;
    readonly description: string;
    readonly body: string;
    readonly tagList?: string[];
}