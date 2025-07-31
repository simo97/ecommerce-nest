import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  Request,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartSummaryDto } from './dto/cart-summary.dto';
import { Cart } from './entities/Cart.entity';
import { CartItem } from './entities/CartItem.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiOperation({ summary: 'Add a product to the cart' })
  @ApiResponse({
    status: 201,
    description: 'Product added to cart successfully',
    type: Cart,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - insufficient stock or invalid product',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-session-token',
    required: false,
    description: 'Session token for anonymous users',
  })
  async addToCart(
    @Body() addToCartDto: AddToCartDto,
    @Request() req: any,
    @Headers('x-session-token') sessionToken?: string,
  ): Promise<Cart> {
    const userId = req.user?.id || null;
    return this.cartService.addToCart(addToCartDto, userId, sessionToken);
  }

  @Delete('remove/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a specific item from the cart' })
  @ApiResponse({
    status: 204,
    description: 'Item removed from cart successfully',
  })
  @ApiResponse({ status: 404, description: 'Cart or cart item not found' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-session-token',
    required: false,
    description: 'Session token for anonymous users',
  })
  async removeFromCart(
    @Param('id') itemId: string,
    @Request() req: any,
    @Headers('x-session-token') sessionToken?: string,
  ): Promise<void> {
    const userId = req.user?.id || null;
    return this.cartService.removeFromCart(userId, itemId, sessionToken);
  }

  @Get('')
  @ApiOperation({ summary: 'Get the content of the cart' })
  @ApiResponse({
    status: 200,
    description: 'Cart content retrieved successfully',
    type: Cart,
  })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-session-token',
    required: false,
    description: 'Session token for anonymous users',
  })
  async getCart(
    @Request() req: any,
    @Headers('x-session-token') sessionToken?: string,
  ): Promise<Cart> {
    const userId = req.user?.id || null;
    console.log({userId})
    return this.cartService.getCart(userId, sessionToken);
  }

  @Delete('empty')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove everything from the cart' })
  @ApiResponse({ status: 204, description: 'Cart emptied successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-session-token',
    required: false,
    description: 'Session token for anonymous users',
  })
  async emptyCart(
    @Request() req: any,
    @Headers('x-session-token') sessionToken?: string,
  ): Promise<void> {
    const userId = req.user?.id || null;
    return this.cartService.emptyCart(userId, sessionToken);
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Get a summary of the cart (total items, total value)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart summary retrieved successfully',
    type: CartSummaryDto,
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-session-token',
    required: false,
    description: 'Session token for anonymous users',
  })
  async getCartSummary(
    @Request() req: any,
    @Headers('x-session-token') sessionToken?: string,
  ): Promise<CartSummaryDto> {
    const userId = req.user?.id || null;
    return this.cartService.getCartSummary(userId, sessionToken);
  }

  @Patch(':id/update')
  @ApiOperation({ summary: 'Update the quantity of an item in the cart' })
  @ApiResponse({
    status: 200,
    description: 'Cart item updated successfully',
    type: CartItem,
  })
  @ApiResponse({ status: 400, description: 'Bad request - insufficient stock' })
  @ApiResponse({ status: 404, description: 'Cart or cart item not found' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-session-token',
    required: false,
    description: 'Session token for anonymous users',
  })
  async updateCartItem(
    @Param('id') itemId: string,
    @Body() updateDto: UpdateCartItemDto,
    @Request() req: any,
    @Headers('x-session-token') sessionToken?: string,
  ): Promise<CartItem> {
    const userId = req.user?.id || null;
    return this.cartService.updateCartItem(
      userId,
      itemId,
      updateDto,
      sessionToken,
    );
  }

  // Public endpoint for anonymous cart operations (using session token only)
  @Public()
  @Post('anonymous/add')
  @ApiOperation({ summary: 'Add a product to anonymous cart (session-based)' })
  @ApiResponse({
    status: 201,
    description: 'Product added to cart successfully',
    type: Cart,
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
  async addToAnonymousCart(
    @Body() addToCartDto: AddToCartDto,
    @Headers('x-session-token') sessionToken: string,
  ): Promise<Cart> {
    if (!sessionToken) {
      throw new Error(
        'Session token is required for anonymous cart operations',
      );
    }
    return this.cartService.addToCart(addToCartDto, sessionToken);
  }

  @Public()
  @Get('anonymous')
  @ApiOperation({ summary: 'Get anonymous cart content (session-based)' })
  @ApiResponse({
    status: 200,
    description: 'Cart content retrieved successfully',
    type: Cart,
  })
  @ApiHeader({
    name: 'x-session-token',
    required: true,
    description: 'Session token for anonymous users',
  })
  async getAnonymousCart(
    @Headers('x-session-token') sessionToken: string,
  ): Promise<Cart> {
    if (!sessionToken) {
      throw new Error(
        'Session token is required for anonymous cart operations',
      );
    }
    return this.cartService.getCart(sessionToken);
  }
}
