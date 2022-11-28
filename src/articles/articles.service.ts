import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticlesService {

    getAll(): string[] {
        return ['Hold on', '...getting articles array']
    }

    getOne(id: number) {
        return `This is one id=${id}, you asked for`
    }
}
