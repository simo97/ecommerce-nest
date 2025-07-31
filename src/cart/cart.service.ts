import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/Cart.entity';
import { CartItem } from './entities/CartItem.entity';
import { Product } from '../catalogue/entities/Product.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartSummaryDto } from './dto/cart-summary.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async addToCart(
    addToCartDto: AddToCartDto,
    userId?: string,
    sessionToken?: string,
  ): Promise<Cart> {
    const { productId, quantity } = addToCartDto;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (!product.isActive) {
      throw new BadRequestException('Product is not available');
    }
    if (product.stockQuantity < quantity) {
      throw new BadRequestException('Insufficient stock available');
    }

    let cart = await this.getOrCreateCart(userId, sessionToken);

    const existingItem = cart.items?.find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stockQuantity < newQuantity) {
        throw new BadRequestException(
          'Insufficient stock for requested quantity',
        );
      }
      existingItem.quantity = newQuantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const cartItem = new CartItem();
      cartItem.cartId = cart.id;
      cartItem.productId = productId;
      cartItem.quantity = quantity;
      await this.cartItemRepository.save(cartItem);
    }
    return (await this.getCartWithItems(cart.id)) as Cart;
  }

  async removeFromCart(
    userId: string,
    itemId: string,
    sessionToken?: string,
  ): Promise<void> {
    const cart = await this.getUserCart(userId, sessionToken);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cartId: cart.id },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(cartItem);
  }

  async getCart(userId?: string, sessionToken?: string): Promise<Cart> {
    const cart = await this.getUserCart(userId, sessionToken);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  async emptyCart(userId: string, sessionToken?: string): Promise<void> {
    const cart = await this.getUserCart(userId, sessionToken);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.cartItemRepository.delete({ cartId: cart.id });
  }

  async getCartSummary(
    userId: string,
    sessionToken?: string,
  ): Promise<CartSummaryDto> {
    const cart = await this.getUserCart(userId, sessionToken);
    if (!cart) {
      return new CartSummaryDto(0, 0, 0);
    }

    const items = await this.cartItemRepository.find({
      where: { cartId: cart.id },
      relations: ['product'],
    });

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0,
    );
    const uniqueProducts = items.length;

    return new CartSummaryDto(totalItems, totalValue, uniqueProducts);
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    updateDto: UpdateCartItemDto,
    sessionToken?: string,
  ): Promise<CartItem> {
    const cart = await this.getUserCart(userId, sessionToken);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cartId: cart.id },
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.product.stockQuantity < updateDto.quantity) {
      throw new BadRequestException(
        'Insufficient stock for requested quantity',
      );
    }

    cartItem.quantity = updateDto.quantity;
    return this.cartItemRepository.save(cartItem);
  }

  private async getOrCreateCart(
    userId?: string,
    sessionToken?: string,
  ): Promise<Cart> {
    let cart = await this.getUserCart(userId, sessionToken);

    if (!cart) {
      cart = new Cart();
      if (userId) {
        cart.userId = userId;
      }
      if (sessionToken) {
        cart.userSession = sessionToken;
      }
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  private async getUserCart(
    userId?: string,
    sessionToken?: string,
  ): Promise<Cart | null> {
    const whereCondition = userId
      ? { userId }
      : sessionToken
        ? { userSession: sessionToken }
        : null;

    if (!whereCondition) {
      return null;
    }

    return this.cartRepository.findOne({
      where: whereCondition,
      relations: ['items', 'items.product'],
    });
  }

  private async getCartWithItems(cartId: string): Promise<Cart | null> {
    return await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });
  }

  async getCartForOrder(
    userId?: string,
    sessionToken?: string,
  ): Promise<Cart | null> {
    return this.getUserCart(userId, sessionToken);
  }

  async clearCart(userId?: string, sessionToken?: string): Promise<void> {
    const cart = await this.getUserCart(userId, sessionToken);
    if (cart) {
      await this.cartItemRepository.delete({ cartId: cart.id });
    }
  }
}
