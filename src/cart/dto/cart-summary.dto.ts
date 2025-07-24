import { ApiProperty } from '@nestjs/swagger';

export class CartSummaryDto {
  @ApiProperty({ description: 'Total number of items in cart' })
  totalItems: number;

  @ApiProperty({
    description: 'Total value of cart',
    type: 'number',
    format: 'decimal',
  })
  totalValue: number;

  @ApiProperty({ description: 'Number of unique products in cart' })
  uniqueProducts: number;

  constructor(totalItems: number, totalValue: number, uniqueProducts: number) {
    this.totalItems = totalItems;
    this.totalValue = totalValue;
    this.uniqueProducts = uniqueProducts;
  }
}
