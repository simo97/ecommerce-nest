import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CatalogueService } from './catalogue.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { AdminDashboardDto } from './dto/admin-dashboard.dto';
import { Product } from './entities/Product.entity';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('admin-catalogue')
@Controller('catalogue/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly catalogueService: CatalogueService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard data' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
    type: AdminDashboardDto,
  })
  async getDashboard(): Promise<AdminDashboardDto> {
    return this.catalogueService.getAdminDashboard();
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products for admin management' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
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
    description: 'Search products by name or description',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter by category name',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by active status (active/inactive)',
  })
  async getProducts(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
  ): Promise<PaginatedResponseDto<Product>> {
    const { page = 1, limit = 10 } = paginationDto;
    const filters = { search, category, status };
    return this.catalogueService.getAdminProducts(page, limit, filters);
  }
}