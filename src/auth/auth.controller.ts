import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninUserDto } from '../users/dto/signin-user.dto';
import { AuthResponseDto } from '../users/dto/auth-response.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'REgister a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfullty',
    type: AuthResponseDto,
  })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<AuthResponseDto> {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('signin')
  @ApiOperation({ summary: 'Sign in user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed in',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signin(@Body() signinUserDto: SigninUserDto): Promise<AuthResponseDto> {
    return this.authService.signin(signinUserDto);
  }
}
