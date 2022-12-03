import { Controller, Get, Param } from '@nestjs/common';
import { User as UserDecorator } from 'src/users/decorator/user.decorator';
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
}
