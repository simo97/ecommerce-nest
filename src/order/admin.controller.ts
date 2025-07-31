import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order } from './entities/Order.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@ApiTags('Orders Admin')
@Controller('orders/admin')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class OrderAdminController {
  constructor(private readonly orderService: OrderService) {}

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
    type: Order,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid status transition',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.orderService.updateOrderStatus(orderId, updateStatusDto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all orders (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'All orders retrieved successfully',
    type: [Order],
  })
  async getAllOrders(): Promise<PaginatedResponseDto<Order>> {
    const orders = await this.orderService.getAllOrders();
    return new PaginatedResponseDto<Order>(orders, orders.length, 0, 100);
  }
}