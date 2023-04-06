import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeepPartial } from './../../common/utils/types/deep-partial.type';
import { FindOptions } from './../../common/utils/types/find-options.type';
import { Forgot } from './models/forgot.model';
import { Model, ObjectId } from 'mongoose';

@Injectable()
export class ForgotService {
  constructor(@InjectModel(Forgot.name) private forgotModel: Model<Forgot>) {}

  async findOne(options: FindOptions<Forgot>) {
    return this.forgotModel.findOne({
      where: options.where,
    });
  }

  async findMany(filter: FindOptions<Forgot>) {
    return this.forgotModel.find({
      filter,
    });
  }

  async create(data: DeepPartial<Forgot>) {
    return this.forgotModel.create(data);
  }

  async softDelete(id: ObjectId): Promise<void> {
    await this.forgotModel.deleteOne(id);
  }
}
