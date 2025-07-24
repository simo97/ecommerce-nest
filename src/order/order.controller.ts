import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Request,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderSummaryDto } from './dto/order-summary.dto';
import { Order } from './entities/Order.entity';
import { Public } from '../auth/decorators/public.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order from cart' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: Order,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - empty cart or insufficient stock',
  })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-session-token',
    required: false,
    description: 'Session token for anonymous users',
  })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: any,
    @Headers('x-session-token') sessionToken?: string,
  ): Promise<Order> {
    const userId = req.user?.sub || null;
    return this.orderService.createOrder(createOrderDto, userId, sessionToken);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: [Order],
  })
  @ApiBearerAuth()
  async getUserOrders(@Request() req: any): Promise<Order[]> {
    const userId = req.user.sub;
    return this.orderService.getUserOrders(userId);
  }

  @Get('summaries')
  @ApiOperation({ summary: 'Get order summaries for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Order summaries retrieved successfully',
    type: [OrderSummaryDto],
  })
  @ApiBearerAuth()
  async getOrderSummaries(@Request() req: any): Promise<OrderSummaryDto[]> {
    const userId = req.user.sub;
    return this.orderService.getOrderSummaries(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiBearerAuth()
  async getOrder(@Param('id') orderId: string): Promise<Order> {
    return this.orderService.getOrder(orderId);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
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
  @ApiBearerAuth()
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.orderService.updateOrderStatus(orderId, updateStatusDto);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({
    status: 200,
    description: 'Order cancelled successfully',
    type: Order,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - order cannot be cancelled',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiBearerAuth()
  async cancelOrder(
    @Param('id') orderId: string,
    @Request() req: any,
  ): Promise<Order> {
    const userId = req.user.sub;
    return this.orderService.cancelOrder(orderId, userId);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/all')
  @ApiOperation({ summary: 'Get all orders (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'All orders retrieved successfully',
    type: [Order],
  })
  @ApiBearerAuth()
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }

  @Public()
  @Post('anonymous')
  @ApiOperation({ summary: 'Create order from anonymous cart (session-based)' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: Order,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - session token required',
  })
  @ApiHeader({
    name: 'x-session-token',
    required: true,
    description: 'Session token for anonymous users',
  })
  async createAnonymousOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Headers('x-session-token') sessionToken: string,
  ): Promise<Order> {
    if (!sessionToken) {
      throw new Error('Session token is required for anonymous order creation');
    }
    return this.orderService.createOrder(
      createOrderDto,
      undefined,
      sessionToken,
    );
  }
}
