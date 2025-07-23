import { Controller , Query, Get , ParseIntPipe } from '@nestjs/common'
import { PaginationDto } from '../common/dto/pagination.dto';
import { CatalogueService } from './catalogue.service';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { Product } from './entities/Product.entity';
import { Category } from './entities/Category.entity';
import { Public } from '../auth/decorators/public.decorator';
import { SearchProductDto } from './dto/search-product.dto';

@Controller("catalogue")
export class CatalogueController{

    constructor(private readonly catalogueService: CatalogueService) {}

    @Public()
    @Get('products')
    @ApiOperation({ summary: 'Get paginated list ofproducts with optional filters' })
    @ApiResponse({ status: 200, description: 'Products retrieved successfully', type: PaginatedResponseDto })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by category name' })
    @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Minimum price filter' })
    @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Maximum price filter' })
    async getProducts(
        @Query() paginationDto: PaginationDto,
        @Query('category') category?: string,
        @Query('minPrice', new ParseIntPipe({ optional: true })) minPrice?: number,
        @Query('maxPrice', new ParseIntPipe({ optional: true })) maxPrice?: number,
    ): Promise<PaginatedResponseDto<Product>> {
        const { page = 1, limit =10 } = paginationDto;
        const filters = { category, minPrice, maxPrice };
        return this.catalogueService.listProducts(page, limit, filters);
    }

    @Public()
    @Get('search')
    @ApiOperation({ summary: 'Search products by name, description, category and stock' })
    @ApiResponse({ status: 200, description: 'Products found successfully', type: [Product] })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for product name/description' })
    @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by category name' })
    @ApiQuery({ name: 'minQuantity', required: false, type: Number, description: 'Minimum stock quantity' })
    async searchProducts(@Query() searchDto: SearchProductDto): Promise<Product[]> {
        return this.catalogueService.searchProduct(searchDto);
    }

    @Public()
    @Get('categories')
    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({ status: 200, description: 'Categories retrieved successfully', type: [Category] })
    async getCategories(): Promise<Category[]> {
          return this.catalogueService.listCategories();
    }

}