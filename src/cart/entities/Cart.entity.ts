import { Entity, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/User.entity';
import { CartItem } from './CartItem.entity';

@Entity('carts')
export class Cart extends BaseEntity {
  @ApiProperty({
    description: 'User who owns the cart',
    type: () => User,
    required: false,
  })
  @OneToOne(() => User, (user) => user.cart, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ApiProperty({
    description: 'User ID who owns the cart',
    example: 'uuid-string',
    required: false,
  })
  @Column('uuid', { nullable: true })
  userId?: string;

  @ApiProperty({
    description: 'Session token for anonymous users',
    example: 'session-token-123',
    required: false,
  })
  @Column({ nullable: true })
  userSession?: string;

  @ApiProperty({ description: 'Items in the cart', type: () => [CartItem] })
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItem[];
}
