import { Injectable } from '@nestjs/common';
import { Product } from './entities/Product.entity';
import { Category } from './entities/Category.entity';
import { MoreThanOrEqual, Repository, LessThanOrEqual } from 'typeorm';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/User.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { PasswordUtil } from '../common/utils/password.util';

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
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
        { search: `%${searchParams.search}%` },
      );
    }
    if (searchParams.category) {
      queryBuilder.andWhere('LOWER(category.name) = LOWER(:category)', {
        category: searchParams.category,
      });
    }

    if (searchParams.minQuantity !== undefined) {
      queryBuilder.andWhere('product.stockQuantity >= :minQuantity', {
        minQuantity: searchParams.minQuantity,
      });
    }
    return queryBuilder.orderBy('product.name', 'ASC').getMany();
  }

  async listCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async listProducts(
    page: number,
    limit: number,
    filters: { category?: string; minPrice?: number; maxPrice?: number },
  ): Promise<PaginatedResponseDto<Product>> {
    const skip = (page - 1) * limit;
    const where: any = { isActive: true };

    if (filters.category) {
      where.category = { name: filters.category };
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice)
        where.price = { ...where.price, ...MoreThanOrEqual(filters.minPrice) };
      if (filters.maxPrice)
        where.price = { ...where.price, ...LessThanOrEqual(filters.maxPrice) };
    }

    const [products, total] = await this.productRepository.findAndCount({
      where,
      skip,
      take: limit,
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });

    return new PaginatedResponseDto<Product>(products, total, page, limit);
  }

  async seedDatabase(options?: { count?: number; clear?: boolean }): Promise<void> {
    const count = options?.count || 10;
    const shouldClear = options?.clear || false;

    if (shouldClear) {
      await this.clearData();
    }

    await this.seedCategories();
    await this.seedUsers(count);
    await this.seedProducts(count * 2);
  }

  private async clearData(): Promise<void> {
    await this.productRepository.deleteAll();
    await this.categoryRepository.deleteAll();
    await this.userRepository.deleteAll();
  }

  private async seedCategories(): Promise<void> {
    const categoriesData = [
      { name: 'Electronics', description: 'Electronic devices and gadgets', isActive: true },
      { name: 'Clothing', description: 'Fashion and apparel items', isActive: true },
      { name: 'Books', description: 'Books and literature', isActive: true },
      { name: 'Home & Garden', description: 'Home improvement and garden supplies', isActive: true },
      { name: 'Sports', description: 'Sports equipment and accessories', isActive: true },
    ];
    let categories: Category[] = []
    for (const categoryData of categoriesData) {
      const existingCategory = await this.categoryRepository.find({
        where: { name: categoryData.name },
      });

      if (!existingCategory) {
        const category = this.categoryRepository.create(categoryData);
        categories.push(category)
      }
    }
    await this.categoryRepository.save(categories);
  }

  private async seedUsers(count: number): Promise<void> {
    const hashedPassword = await PasswordUtil.hashPassword('password123');

    const adminUser = this.userRepository.create({
      email: 'admin@ecommerce.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    });

    await this.userRepository.save(adminUser);
    let users: User[] = []
    for (let i = 1; i <= count; i++) {
      users.push(this.userRepository.create({
        email: `user${i}@example.com`,
        password: hashedPassword,
        firstName: `User${i}`,
        lastName: `Test`,
        role: UserRole.CUSTOMER,
      }))
    }
    await this.userRepository.save(users);
  }

  private async seedProducts(count: number): Promise<void> {
    const categories = await this.categoryRepository.find();

    if (categories.length === 0) {
      throw new Error('No categories found. Please seed categories first.');
    }

    const productNames = [
      'Smartphone Pro Max', 'Wireless Headphones', 'Gaming Laptop', 'Smart Watch',
      'T-Shirt Cotton', 'Jeans Denim', 'Running Shoes', 'Winter Jacket',
      'Programming Book', 'Science Fiction Novel', 'Cookbook Deluxe', 'History Atlas',
      'Coffee Table', 'Garden Hose', 'LED Lamp', 'Kitchen Knife Set',
      'Basketball', 'Tennis Racket', 'Yoga Mat', 'Dumbbell Set'
    ];
    let productsSeed: Product[] = []
    for (let i = 0; i < count; i++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const nameIndex = i % productNames.length;

      const product = this.productRepository.create({
        name: `${productNames[nameIndex]} ${Math.floor(i / productNames.length) + 1}`,
        description: `High quality ${productNames[nameIndex].toLowerCase()} for your needs`,
        price: Math.floor(Math.random() * 500) + 10,
        stockQuantity: Math.floor(Math.random() * 100) + 1,
        categoryId: randomCategory.id,
        isActive: Math.random() > 0.1,
        imageUrl: `https://picsum.photos/400/300?random=${i}`,
      });
      productsSeed.push(product)
    }
    await this.productRepository.save(productsSeed);
  }
}
