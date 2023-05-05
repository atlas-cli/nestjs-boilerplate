import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPaginationOptions } from './../../common/utils/types/pagination-options';
import { Model } from 'mongoose';
import { Plan, PlanDocument } from './../models/plan.model';
import { Product, ProductDocument } from './../models/product.model';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(Plan.name)
    private planModel: Model<PlanDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  findOne(id: number | string) {
    return this.planModel.findOne({ _id: parseInt(id.toString()) });
  }
  findManyWithPagination(paginationOptions: IPaginationOptions) {
    return this.planModel
      .find()
      .skip(paginationOptions.skip)
      .limit(paginationOptions.limit);
  }
  findAllProducts() {
    return this.productModel.find();
  }
}
