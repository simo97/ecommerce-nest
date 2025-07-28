import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/User.entity';
import { PasswordUtil } from '../common/utils/password.util';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findMany(): Promise<User[] | undefined> {
    return this.userRepository.find();
  }

  async createSample(email: string, firstName: string, lastName: string) {
    const user = new User();
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.password = await PasswordUtil.hashPassword('heheehhe');
    return this.userRepository.save(user);
  }

  /**
   * Create a user account with a provided password.
   * @author Adonis SIMO <simoadonis@yahoo.fr>
   */
  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const { email, firstName, lastName, password } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = new User();
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.password = await PasswordUtil.hashPassword(password);

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const payload = { sub: savedUser.id, email: savedUser.email };
    const access_token = this.jwtService.sign(payload);

    return new AuthResponseDto(access_token, savedUser);
  }

  /**
   * Sign a user in based on his email and passeord, this will return the JWT token (access token)
   *
   * @author Adonis SIMO <simoadonis@yahoo.fr>
   */
  async signin(signinUserDto: SigninUserDto): Promise<AuthResponseDto> {
    const { email, password } = signinUserDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }

    const isPasswordValid = await PasswordUtil.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email , role: user.role };

    const access_token = this.jwtService.sign(payload);
    return new AuthResponseDto(access_token, user);
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
