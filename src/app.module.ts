import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TagsModule } from './tags/tags.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from 'ormconfig';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(ormConfig), TagsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
