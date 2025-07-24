import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { Cart } from './Cart.entity';
import { Product } from '../../catalogue/entities/Product.entity';

@Entity('cart_items')
export class CartItem extends BaseEntity {
  @ApiProperty({ description: 'Quantity of the product in cart', example: 3 })
  @Column('int')
  quantity: number;

  @ApiProperty({ description: 'Cart this item belongs to', type: () => Cart })
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @ApiProperty({ description: 'Cart ID', example: 'uuid-string' })
  @Column('uuid')
  cartId: string;

  @ApiProperty({ description: 'Product information', type: () => Product })
  @ManyToOne(() => Product, (product) => product.cartItems)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ApiProperty({ description: 'Product ID', example: 'uuid-string' })
  @Column('uuid')
  productId: string;
}
