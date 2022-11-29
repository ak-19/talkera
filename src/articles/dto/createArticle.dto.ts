import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateArticleDTO {

    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    readonly body: string;

    readonly tagList?: string[];
}