import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { Profile } from './type/profile.type';
import { ProfileResponse } from './type/profileResponse.interface';

@Injectable()
export class ProfileService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {

    }

    createProfileResponse(profile: Profile): ProfileResponse {
        delete profile.id;
        delete profile.email;
        return {
            profile
        };
    }
    async getProfile(currentUserId: number, username: string): Promise<Profile> {
        const user = await this.userRepository.findOneBy({ username });

        if (!user) throw new HttpException('The profile not found', HttpStatus.NOT_FOUND);

        if (currentUserId) {
            // TODO update following !!
        }

        return {
            ...user,
            following: false
        }
    }
}
