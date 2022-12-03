import { Controller, Get, Param } from '@nestjs/common';
import { User as UserDecorator } from 'src/users/decorator/user.decorator';
import { ProfileService } from './profile.service';

@Controller('api/profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Get(':id')
    getProfile(@UserDecorator('id') currentUserId: number, @Param('id') id: number) {
        console.log(currentUserId, id);

        return this.profileService.getProfile(currentUserId, id);
    }
}
