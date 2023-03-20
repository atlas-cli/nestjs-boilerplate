import { Injectable } from '@nestjs/common';
import { IPaginationOptions } from './../common/utils/types/pagination-options';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor() {}

  create(createProfileDto: CreateUserDto) {
    return {} as any;
  }

  findManyWithPagination(paginationOptions: IPaginationOptions) {
    return {} as any;
  }

  findOne(fields) {
    return {} as any;
  }

  update(id: number, updateProfileDto: UpdateUserDto) {
    return {} as any;
  }

  async softDelete(id: number): Promise<void> {
    await {};
  }
}
