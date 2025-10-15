
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string): Promise<any> {

    const user = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.email = :email", { email: email })
      .getOne();
    if (!user) {
      throw new UnauthorizedException('User Not Found')
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentilas!!!')
    }
    const { password: _, ...result } = user;
    return result
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersRepository
      .createQueryBuilder("u")
      .leftJoin("u.role", "role")
      .select([
        "u.id",
        "u.email",
        "u.name",
        "role.id",
        "role.name",
      ])
      .where("u.email = :email", { email })
      .getOne();
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email, role: user.role.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
    
  }
}

