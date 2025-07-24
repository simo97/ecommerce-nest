import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../common/enums/order-status.enum';

export class OrderSummaryDto {
  @ApiProperty({ description: 'Order ID' })
  id: string;

  @ApiProperty({
    description: 'Total amount of the order',
    type: 'number',
    format: 'decimal',
  })
  totalAmount: number;

  @ApiProperty({ description: 'Order status', enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({ description: 'Number of items in the order' })
  totalItems: number;

  @ApiProperty({ description: 'Order creation date' })
  createdAt: Date;

  constructor(
    id: string,
    totalAmount: number,
    status: OrderStatus,
    totalItems: number,
    createdAt: Date,
  ) {
    this.id = id;
    this.totalAmount = totalAmount;
    this.status = status;
    this.totalItems = totalItems;
    this.createdAt = createdAt;
  }
}
