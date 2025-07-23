import { Injectable } from '@nestjs/common';
import { Product } from './entities/Product.entity';
import { Category } from './entities/Category.entity';
import { MoreThanOrEqual, Repository, LessThanOrEqual } from 'typeorm';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { InjectRepository } from '@nestjs/typeorm';

/**
 *
 */
@Injectable()
export class CatalogueService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    async searchProduct(searchParams: {
        search?: string;
        category?: string;
        minQuantity?: number;
    }): Promise<Product[]> {
        const queryBuilder = this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.isActive = :isActive', { isActive: true });

        if (searchParams.search) {
            queryBuilder.andWhere(
                '(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search))',
                { search: `%${searchParams.search}%` }
            );
        }
        if (searchParams.category) {
            queryBuilder.andWhere('LOWER(category.name) = LOWER(:category)', {
                category: searchParams.category
            });
        }

        if (searchParams.minQuantity !== undefined) {
            queryBuilder.andWhere('product.stockQuantity >= :minQuantity', {
                minQuantity: searchParams.minQuantity
            });
        }
        return queryBuilder
            .orderBy('product.name', 'ASC')
            .getMany();
    }

    async listCategories(): Promise<Category[]>{
        return await this.categoryRepository.find()
    }

    async listProducts(
        page: number,
        limit: number,
        filters: { category?: string; minPrice?: number; maxPrice?: number }
    ): Promise<PaginatedResponseDto<Product>> {
        const skip = (page - 1) * limit;
        const where: any = { isActive: true };

        if (filters.category) {
            where.category = { name: filters.category };
        }

        if (filters.minPrice || filters.maxPrice) {
            where.price = {};
            if (filters.minPrice) where.price = {...where.price, ...MoreThanOrEqual(filters.minPrice) };
            if (filters.maxPrice) where.price = {...where.price, ...LessThanOrEqual(filters.maxPrice) };
        }

        const [products, total] = await this.productRepository.findAndCount({
            where,
            skip,
            take: limit,
            relations: ['category'],
            order: { createdAt: 'DESC' }
        });

        return new PaginatedResponseDto<Product>(products, total, page, limit)
    }
}
