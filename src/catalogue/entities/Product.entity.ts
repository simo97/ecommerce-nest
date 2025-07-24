import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { Category } from './Category.entity';
import { CartItem } from '../../cart/entities/CartItem.entity';
import { OrderItem } from '../../order/entities/Orderitem.entity';

@Entity('products')
export class Product extends BaseEntity {
  @ApiProperty({ description: 'Product name', example: 'iPhone 14 Pro' })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest iPhone with pro camera system',
  })
  @Column('text')
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
    type: 'number',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Available stock quantity', example: 50 })
  @Column('int')
  stockQuantity: number;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty({
    description: 'Whether the product is active/available',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Product category', type: () => Category })
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ApiProperty({ description: 'Category ID', example: 'uuid-string' })
  @Column('uuid')
  categoryId: string;

  @ApiProperty({
    description: 'Cart items containing this product',
    type: () => [CartItem],
  })
  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @ApiProperty({
    description: 'Order items containing this product',
    type: () => [OrderItem],
  })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];
}
