import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogueService } from './catalogue.service';
import { CatalogueController } from './catalogue.controller';
import { AdminController } from './admin.controller';
import { Product } from './entities/Product.entity';
import { Category } from './entities/Category.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/entities/User.entity';
import { Order } from '../order/entities/Order.entity';

@Module({
  controllers: [CatalogueController, AdminController],
  providers: [CatalogueService],
  imports: [
    TypeOrmModule.forFeature([Product, Category, User, Order]),
    forwardRef(() => AuthModule),
  ],
})
export class CatalogueModule {}
