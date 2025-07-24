import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/Order.entity';
import { OrderItem } from './entities/Orderitem.entity';
import { Product } from '../catalogue/entities/Product.entity';
import { CartService } from '../cart/cart.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderSummaryDto } from './dto/order-summary.dto';
import { OrderStatus } from '../common/enums/order-status.enum';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private cartService: CartService,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    userId?: string,
    sessionToken?: string,
  ): Promise<Order> {
    if (!userId && !sessionToken) {
      throw new BadRequestException('User ID or session token required');
    }

    const cart = await this.cartService.getCartForOrder(userId, sessionToken);

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty or not found');
    }

    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw new BadRequestException(
          `Product ${item.product.name} is no longer available`,
        );
      }
      if (item.product.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${item.product.name}`,
        );
      }
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0,
    );

    const order = new Order();
    order.userId = userId!;
    order.totalAmount = totalAmount;
    order.status = OrderStatus.PENDING;
    order.shippingAddress = createOrderDto.shippingAddress;
    order.notes = createOrderDto.notes;

    const savedOrder = await this.orderRepository.save(order);

    const orderItems = cart.items.map((item) => {
      const orderItem = new OrderItem();
      orderItem.orderId = savedOrder.id;
      orderItem.productId = item.productId;
      orderItem.quantity = item.quantity;
      orderItem.priceAtTime = item.product.price;

      return orderItem;
    });

    await this.orderItemRepository.save(orderItems);

    for (const item of cart.items) {
      await this.productRepository.update(item.productId, {
        stockQuantity: () => `stockQuantity - ${item.quantity}`,
      });
    }

    await this.cartService.clearCart(userId, sessionToken);

    return this.getOrder(savedOrder.id);
  }

  async getOrder(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(
    orderId: string,
    updateStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (
      order.status === OrderStatus.CANCELLED ||
      order.status === OrderStatus.DELIVERED
    ) {
      throw new BadRequestException(
        'Cannot update status of cancelled or delivered order',
      );
    }

    order.status = updateStatusDto.status;
    await this.orderRepository.save(order);

    return this.getOrder(orderId);
  }

  async cancelOrder(orderId: string, userId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    order.status = OrderStatus.CANCELLED;
    await this.orderRepository.save(order);

    for (const item of order.items) {
      await this.productRepository.update(item.productId, {
        stockQuantity: () => `stockQuantity + ${item.quantity}`,
      });
    }

    return this.getOrder(orderId);
  }

  async getOrderSummaries(userId: string): Promise<OrderSummaryDto[]> {
    const orders = await this.orderRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => {
      const totalItems = order.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      return new OrderSummaryDto(
        order.id,
        order.totalAmount,
        order.status,
        totalItems,
        order.createdAt,
      );
    });
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['items', 'items.product', 'user'],
      order: { createdAt: 'DESC' },
    });
  }
}
