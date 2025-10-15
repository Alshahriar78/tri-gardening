import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsersRoleDto } from './dto/create-users_role.dto';
import { UpdateUsersRoleDto } from './dto/update-users_role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRole } from './entities/users_role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRoleService {

  constructor(
    @InjectRepository(UsersRole)
    private readonly usersRoleRepo: Repository<UsersRole>
  ) { }
  async create(createUsersRoleDto: CreateUsersRoleDto) {
    const data = this.usersRoleRepo.create(createUsersRoleDto)
    return await this.usersRoleRepo.save(data);
  }

  async findAll() {
    return await this.usersRoleRepo.find()
  }

  async findOne(id: number) {
    const data = await this.usersRoleRepo.findOne({ where: { id } });
    if (!data) throw new NotFoundException(`User role with ID ${id} not found`);
    return data;
  }

  async update(id: number, updateUsersRoleDto: UpdateUsersRoleDto) {
    const find = await this.findOne(id);
    const data = this.usersRoleRepo.merge(find,updateUsersRoleDto);
    const upData = await this.usersRoleRepo.save(data);
    return data; 
    
  }

  remove(id: number) {
    return `This action removes a #${id} usersRole`;
  }
}
