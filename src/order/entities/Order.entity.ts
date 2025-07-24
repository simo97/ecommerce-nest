import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { User } from '../../users/entities/User.entity';
import { OrderItem } from './Orderitem.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @ApiProperty({
    description: 'Total amount of the order',
    example: 99.99,
    type: 'number',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ApiProperty({ description: 'User who placed the order', type: () => User })
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({
    description: 'User ID who placed the order',
    example: 'uuid-string',
  })
  @Column('uuid')
  userId: string;

  @ApiProperty({ description: 'Items in the order', type: () => [OrderItem] })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @ApiProperty({
    description: 'Shipping address',
    example: '123 Main St, City, Country',
    required: false,
  })
  @Column()
  shippingAddress?: string;

  @ApiProperty({
    description: 'Additional notes for the order',
    example: 'Please handle with care',
    required: false,
  })
  @Column()
  notes?: string;
}
