import { ClientProxy } from '@nestjs/microservices';
import { CreateProfileDto } from '../lib/dto/create-profile.dto';
import { UpdateProfileDto } from '../lib/dto/update-profile.dto';
import { ProfileResponseDto } from '../lib/dto/profile-response.dto';
import { ProfileListResponseDto } from '../lib/dto/profile-list-response.dto';
export declare class UserProfileController {
    private readonly userClient;
    constructor(userClient: ClientProxy);
    create(dto: CreateProfileDto): Promise<ProfileResponseDto>;
    findById(id: string): Promise<ProfileResponseDto>;
    findByAuthUserId(authUserId: string): Promise<ProfileResponseDto>;
    update(id: string, dto: UpdateProfileDto): Promise<ProfileResponseDto>;
    delete(id: string): Promise<ProfileResponseDto>;
    findAll(page?: number, limit?: number): Promise<ProfileListResponseDto>;
}
