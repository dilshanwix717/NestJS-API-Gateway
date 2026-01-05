import type { ClientProxy } from '@nestjs/microservices';
import type { JwtPayload } from '../lib/auth/jwt-payload';
import type { UserDto } from '../lib/dto/user.dto';
export declare class UserController {
    private readonly userClient;
    constructor(userClient: ClientProxy);
    getUserProfile(user: JwtPayload): Promise<UserDto>;
}
