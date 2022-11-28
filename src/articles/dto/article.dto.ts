import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class ArticleDTO {

    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    readonly body: string;

    @IsArray()
    readonly tagList: string[];
}