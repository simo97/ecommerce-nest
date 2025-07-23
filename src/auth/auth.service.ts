import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninUserDto } from '../users/dto/signin-user.dto';
import { AuthResponseDto } from '../users/dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    return this.userService.register(createUserDto);
  }

  async signin(signinUserDto: SigninUserDto): Promise<AuthResponseDto> {
    return this.userService.signin(signinUserDto);
  }

  async validateUser(email: string): Promise<any> {
    return this.userService.findByEmail?.(email);
  }
}
