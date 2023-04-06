import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IPaginationOptions } from './../common/utils/types/pagination-options';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createProfileDto: CreateUserDto) {
    return this.userModel.create(createProfileDto);
  }

  findManyWithPagination(paginationOptions: IPaginationOptions) {
    return this.userModel.find({
      options: paginationOptions,
    });
  }

  findOne(fields) {
    return this.userModel.findOne(fields);
  }

  update(id: Types.ObjectId, updateProfileDto: UpdateUserDto) {
    return this.userModel.updateOne(
      {
        _id: id,
      },
      {
        ...updateProfileDto,
      },
    );
  }

  async softDelete(id: Types.ObjectId): Promise<void> {
    await this.userModel.deleteOne({ _id: id });
  }
}
