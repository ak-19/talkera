import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [ConfigModule.forRoot(), TagsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
