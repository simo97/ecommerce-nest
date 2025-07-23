import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { UserService } from './user.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User]), forwardRef(()=>AuthModule)],
  exports: [UserService, TypeOrmModule],
  controllers: [UsersController],
})
export class UsersModule {}
