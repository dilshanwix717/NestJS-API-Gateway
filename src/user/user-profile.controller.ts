import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../guards/auth/auth.guard';
import { CreateProfileDto } from '../lib/dto/create-profile.dto';
import { UpdateProfileDto } from '../lib/dto/update-profile.dto';

@Controller('user/profiles')
@UseGuards(AuthGuard)
export class UserProfileController {
  constructor(
    @Inject('USER-SERVICE') private readonly userClient: ClientProxy,
  ) {}

  /**
   * POST /user/profiles
   */
  @Post()
  async create(@Body() dto: CreateProfileDto) {
    return firstValueFrom(this.userClient.send('user.profile.create', dto));
  }

  /**
   * GET /user/profiles/:id
   */
  @Get(':id')
  async findById(@Param('id') id: string) {
    return firstValueFrom(
      this.userClient.send('user.profile.findById', { id }),
    );
  }

  /**
   * GET /user/profiles/auth/:authUserId
   */
  @Get('auth/:authUserId')
  async findByAuthUserId(@Param('authUserId') authUserId: string) {
    return firstValueFrom(
      this.userClient.send('user.profile.findByAuthUserId', { authUserId }),
    );
  }

  /**
   * PUT /user/profiles/:id
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return firstValueFrom(
      this.userClient.send('user.profile.update', { id, dto }),
    );
  }

  /**
   * DELETE /user/profiles/:id
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return firstValueFrom(this.userClient.send('user.profile.delete', { id }));
  }

  /**
   * GET /user/profiles?page=1&limit=10
   */
  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return firstValueFrom(
      this.userClient.send('user.profile.findAll', {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      }),
    );
  }
}
