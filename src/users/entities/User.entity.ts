import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { Cart } from '../../cart/entities/Cart.entity';
import { Order } from '../../order/entities/Order.entity';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'User password (hashed)', writeOnly: true })
  @Column()
  password: string;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @Column()
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @Column()
  lastName: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.CUSTOMER,
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'JWT refresh token',
    writeOnly: true,
    required: false,
  })
  @Column({ nullable: true })
  refreshToken: string;

  @ApiProperty({
    description: 'User shopping cart',
    type: () => Cart,
    required: false,
  })
  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @ApiProperty({ description: 'User order history', type: () => [Order] })
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
