import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Follow } from './entity/follow.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User])],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule { }
