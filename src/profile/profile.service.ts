import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { Follow } from './entity/follow.entity';
import { Profile } from './type/profile.type';
import { ProfileResponse } from './type/profileResponse.interface';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Follow) private readonly followRepository: Repository<Follow>
    ) { }

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

    async followProfile(currentUserId: number, username: string) {
        const user = await this.userRepository.findOneBy({ username })

        if (!user) throw new HttpException('The profile not found', HttpStatus.NOT_FOUND);

        if (user.id === currentUserId) throw new HttpException('You can not follow you self', HttpStatus.BAD_REQUEST)

        let following = await this.followRepository.findOne({ where: { followerId: currentUserId, followingId: user.id } });

        if (following) throw new HttpException('You are already following that profile', HttpStatus.BAD_REQUEST);

        following = new Follow();

        following.followerId = currentUserId;
        following.followingId = user.id;

        await this.followRepository.save(following);

        return {
            ...user,
            following: true
        }
    }

    async unfollowProfile(currentUserId: number, username: string) {
        const user = await this.userRepository.findOneBy({ username })

        if (!user) throw new HttpException('The profile not found', HttpStatus.NOT_FOUND);

        if (user.id === currentUserId) throw new HttpException('You can not unfollow you self', HttpStatus.BAD_REQUEST)

        const following = await this.followRepository.findOne({ where: { followerId: currentUserId, followingId: user.id } });

        if (!following) throw new HttpException('You are not following that profile', HttpStatus.BAD_REQUEST);

        await this.followRepository.delete(following);

        return {
            ...user,
            following: false
        }
    }
}
