import { Controller, Get, Post } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { UserService } from './user.service';
import { User } from './entities/User.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {
    this.userService = userService;
  }

  @Public()
  @Get()
  async listUser(): Promise<User[]> {
    return (await this.userService.findMany()) || [];
  }

  @Public()
  @Post()
  async createSampleUser(): Promise<User> {
    return await this.userService.createSample(
      'denali@mail.com',
      'Kimy',
      'denaliue',
    );
  }
}
