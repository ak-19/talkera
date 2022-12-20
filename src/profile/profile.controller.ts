import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User as UserDecorator } from 'src/users/decorator/user.decorator';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { ProfileService } from './profile.service';
import { Profile } from './type/profile.type';
import { ProfileResponse } from './type/profileResponse.interface';

@Controller('api/profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }


    @Get()
    async getProfiles(@UserDecorator('id') currentUserId): Promise<Profile[]> {
        const profiles = await this.profileService.getProfiles();

        return profiles;
    }

    @Get(':username')
    async getProfile(@UserDecorator('id') currentUserId: number, @Param('username') username: string): Promise<ProfileResponse> {
        const profile = await this.profileService.getProfile(currentUserId, username);

        return this.profileService.createProfileResponse(profile);
    }

    @Post(":username/follow")
    @UseGuards(AuthGuard)
    async followProfile(@UserDecorator('id') currentUserId: number, @Param('username') username: string): Promise<ProfileResponse> {
        const profile = await this.profileService.followProfile(currentUserId, username);
        return this.profileService.createProfileResponse(profile);
    }

    @Delete(":username/follow")
    @UseGuards(AuthGuard)
    async unfollowProfile(@UserDecorator('id') currentUserId: number, @Param('username') username: string): Promise<ProfileResponse> {
        const profile = await this.profileService.unfollowProfile(currentUserId, username);
        return this.profileService.createProfileResponse(profile);
    }
}
