import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { Profile } from './type/profile.type';

@Injectable()
export class ProfileService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {

    }

    async getProfile(currentUserId: number, profileId: number): Promise<Profile> {
        const user = await this.userRepository.findOneBy({ id: profileId });
        console.log(user);

        const profile = {
            ...user
        };
        return profile;
    }
}
