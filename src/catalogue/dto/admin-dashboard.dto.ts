import { ApiProperty } from '@nestjs/swagger';

export class AdminOrderSummaryDto {
  @ApiProperty({ description: 'Order ID' })
  id: string;

  @ApiProperty({ description: 'Total amount of the order' })
  totalAmount: number;

  @ApiProperty({ description: 'Order status' })
  status: string;

  @ApiProperty({ description: 'Customer name' })
  customerName: string;

  @ApiProperty({ description: 'Order creation date' })
  createdAt: Date;
}

export class AdminDashboardDto {
  @ApiProperty({ description: 'Total sales amount', example: 15000.50 })
  totalSales: number;

  @ApiProperty({ description: 'Total number of orders', example: 156 })
  totalOrders: number;

  @ApiProperty({ description: 'Total number of products', example: 250 })
  totalProducts: number;

  @ApiProperty({ description: 'Total number of users', example: 89 })
  totalUsers: number;

  @ApiProperty({ 
    description: 'Last 6 orders summary', 
    type: [AdminOrderSummaryDto]
  })
  recentOrders: AdminOrderSummaryDto[];
}