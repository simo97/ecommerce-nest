import { Controller, Query, Get, ParseIntPipe, Post, ForbiddenException, Body, Param } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CatalogueService } from './catalogue.service';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { Product } from './entities/Product.entity';
import { Category } from './entities/Category.entity';
import { Public } from '../auth/decorators/public.decorator';
import { SearchProductDto } from './dto/search-product.dto';
import { ConfigService } from '@nestjs/config';

@Controller('catalogue')
export class CatalogueController {
  constructor(
    private readonly catalogueService: CatalogueService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get('all')
  @ApiOperation({
    summary: 'Get paginated list ofproducts with optional filters',
  })
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
    name: 'category',
    required: false,
    type: String,
    description: 'Filter by category name',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Minimum price filter',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Maximum price filter',
  })
  async getProducts(
    @Query() paginationDto: PaginationDto,
    @Query('category') category?: string,
    @Query('minPrice', new ParseIntPipe({ optional: true })) minPrice?: number,
    @Query('maxPrice', new ParseIntPipe({ optional: true })) maxPrice?: number,
  ): Promise<PaginatedResponseDto<Product>> {
    const { page = 1, limit = 10 } = paginationDto;
    const filters = { category, minPrice, maxPrice };
    return this.catalogueService.listProducts(page, limit, filters);
  }

  @Public()
  @Get('/:id')
  @ApiOperation({
    summary: 'Retrieve one product object',
  })
  @ApiResponse({
    status: 200,
    description: 'Product found successfully',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    type: Product,
  })
  async getOneProduct(
    @Param('id') id: string
  ): Promise<Product>{
    const product: Product | null = await this.catalogueService.getProduct(id)
    if (!product){
      throw new Error(`Product not found `);
    }
    return product
  }

  @Public()
  @Get('search')
  @ApiOperation({
    summary: 'Search products by name, description, category and stock',
  })
  @ApiResponse({
    status: 200,
    description: 'Products found successfully',
    type: [Product],
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for product name/description',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter by category name',
  })
  @ApiQuery({
    name: 'minQuantity',
    required: false,
    type: Number,
    description: 'Minimum stock quantity',
  })
  async searchProducts(
    @Query() searchDto: SearchProductDto,
  ): Promise<Product[]> {
    return this.catalogueService.searchProduct(searchDto);
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: [Category],
  })
  async getCategories(): Promise<Category[]> {
    return this.catalogueService.listCategories();
  }

  @Public()
  @Post('seed')
  @ApiOperation({ summary: 'Seed database with sample data (setup only)' })
  @ApiResponse({
    status: 200,
    description: 'Database seeded successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Setup mode not enabled',
  })
  async seedDatabase(
    @Body() options?: { count?: number; clear?: boolean },
  ): Promise<{ message: string }> {
    const isSetup = this.configService.get<string>('IS_SETUP');

    if (isSetup !== 'true') {
      throw new ForbiddenException('Setup mode is not enabled');
    }

    try {
      await this.catalogueService.seedDatabase(options);
      return { message: 'Database seeded successfully' };
    } catch (error) {

      throw new Error(`Failed to seed database: ${error.message}`);
    }
  }
}


