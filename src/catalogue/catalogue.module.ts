import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogueService } from './catalogue.service';
import { CatalogueController } from './catalogue.controller'
import {Product} from './entities/Product.entity'
import {Category} from './entities/Category.entity'
import { AuthModule } from '../auth/auth.module';


@Module({
  controllers: [CatalogueController],
  providers: [CatalogueService],
  imports: [TypeOrmModule.forFeature([Product, Category]), forwardRef(()=>AuthModule)]
})
export class CatalogueModule {}
