import { Module } from '@nestjs/common';
import { UsersRoleService } from './users_role.service';
import { UsersRoleController } from './users_role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRole } from './entities/users_role.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UsersRole])],
  controllers: [UsersRoleController],
  providers: [UsersRoleService],
  exports:[TypeOrmModule]
})
export class UsersRoleModule {}
