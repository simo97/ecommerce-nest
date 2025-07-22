import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Cart } from './Cart.entity';
import { Product } from '../../catalogue/entities/Product.entity';

@Entity('cart_items')
export class CartItem extends BaseEntity {
  @Column('int')
  quantity: number;

  @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @Column('uuid')
  cartId: string;

  @ManyToOne(() => Product, product => product.cartItems)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column('uuid')
  productId: string;
}