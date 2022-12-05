import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User as UserDecorator } from 'src/users/decorator/user.decorator';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { ProfileService } from './profile.service';
import { ProfileResponse } from './type/profileResponse.interface';

@Controller('api/profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

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
}
