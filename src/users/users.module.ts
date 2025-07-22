import { Module } from '@nestjs/common';
//import { UserService } from './users/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { UserService } from './user.service';

@Module({
  providers: [ UserService],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UserService, TypeOrmModule],
  controllers: []
})
export class UsersModule {}
