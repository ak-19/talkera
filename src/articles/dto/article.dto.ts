import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class ArticleDTO {

    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly description: string;

    @IsNotEmpty()
    readonly body: string;

    readonly tagList?: string[];
}