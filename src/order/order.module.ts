import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/Order.entity';
import { OrderItem } from './entities/Orderitem.entity';

@Module({
  providers: [],
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  exports: [TypeOrmModule],
  controllers: [],
})
export class OrderModule {}
