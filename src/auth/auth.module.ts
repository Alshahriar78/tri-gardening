import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports:[
   forwardRef(() => UsersModule),
    JwtModule.register({
      global:true,
      secret:jwtConstants.secret,
      signOptions:{expiresIn:'6h'},
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
  ],
  exports:[AuthService]
})
export class AuthModule {}
