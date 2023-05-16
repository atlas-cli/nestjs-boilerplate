import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPaginationOptions } from './../../common/utils/types/pagination-options';
import { Model, Types, UpdateQuery } from 'mongoose';
import { User } from './../models/user.model';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import {
  Organization,
  OrganizationDocument,
} from './models/organization.model';
import { UsersService } from './../users.service';
import { RoleEnum } from './../../common/access-control/roles/roles.enum';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    private usersService: UsersService,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto, user: User) {
    const organizationId = new Types.ObjectId();
    const owner = new Types.ObjectId(user._id);
    await this.usersService.updateGrantAccessToOrganization(
      user._id,
      organizationId,
      RoleEnum.teacher,
    );
    return await this.organizationModel.create({
      _id: organizationId,
      name: createOrganizationDto.name,
      email: createOrganizationDto.email,
      owner,
      plan: 0,
    });
  }

  findManyWithPagination(paginationOptions: IPaginationOptions, filter: any) {
    return this.organizationModel
      .find(filter)
      .skip(paginationOptions.skip)
      .limit(paginationOptions.limit);
  }

  findOne(_id) {
    return this.organizationModel.findOne({ _id });
  }

  update(
    id: string | Types.ObjectId,
    updateProfileDto: UpdateQuery<OrganizationDocument>,
  ) {
    return this.organizationModel.updateOne(
      {
        _id: id,
      },
      {
        ...updateProfileDto,
      },
    );
  }

  async remove(id: string): Promise<void> {
    const organizationId = new Types.ObjectId(id);
    await this.usersService.updateDisgraceAccessToOrganization(organizationId);
    await this.organizationModel.deleteOne({ _id: id });
  }
}
