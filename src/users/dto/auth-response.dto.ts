import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/User.entity';

export class AuthResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: Omit<User, 'password'>;

  constructor(access_token: string, user: User) {
    this.access_token = access_token;
    const { password, ...userWithoutPassword } = user;
    this.user = userWithoutPassword;
  }
}
