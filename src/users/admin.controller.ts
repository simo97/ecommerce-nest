import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/User.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { Roles } from '../auth/decorators/roles.decorator';


@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiTags('admin-users')
@Controller('users/admin')
export class UsersAdminController {
  constructor(private readonly userService: UserService) {
    this.userService = userService;
  }
  @Get('all')
  @ApiOperation({ summary: 'Get all users for admin management' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: PaginatedResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search users by name or email',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    type: String,
    description: 'Filter by user role (customer/admin)',
  })
  async getUsers(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ): Promise<PaginatedResponseDto<User>> {
    const { page = 1, limit = 10 } = paginationDto;
    const filters = { search, role };
    return this.userService.getAdminUsers(page, limit, filters);
  }
}
