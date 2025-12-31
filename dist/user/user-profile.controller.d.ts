import { ClientProxy } from '@nestjs/microservices';
import { CreateProfileDto } from '../lib/dto/create-profile.dto';
import { UpdateProfileDto } from '../lib/dto/update-profile.dto';
export declare class UserProfileController {
    private readonly userClient;
    constructor(userClient: ClientProxy);
    create(dto: CreateProfileDto): Promise<any>;
    findById(id: string): Promise<any>;
    findByAuthUserId(authUserId: string): Promise<any>;
    update(id: string, dto: UpdateProfileDto): Promise<any>;
    delete(id: string): Promise<any>;
    findAll(page?: number, limit?: number): Promise<any>;
}
