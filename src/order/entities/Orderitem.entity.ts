import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { Order } from './Order.entity';
import { Product } from '../../catalogue/entities/Product.entity';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @ApiProperty({ description: 'Quantity of the product ordered', example: 2 })
  @Column('int')
  quantity: number;

  @ApiProperty({
    description: 'Price of the product at the time of order',
    example: 49.99,
    type: 'number',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  priceAtTime: number;

  @ApiProperty({ description: 'Order this item belongs to', type: () => Order })
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ApiProperty({ description: 'Order ID', example: 'uuid-string' })
  @Column('uuid')
  orderId: string;

  @ApiProperty({ description: 'Product information', type: () => Product })
  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ApiProperty({ description: 'Product ID', example: 'uuid-string' })
  @Column('uuid')
  productId: string;
}
