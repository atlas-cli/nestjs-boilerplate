import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Role,
  RoleDocument,
} from './../../../access-control/roles/models/role.model';
import { RolesBuilder } from '../../../access-control/roles/roles.builder';
import { Model } from 'mongoose';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectModel(Role.name) private repository: Model<RoleDocument>,
  ) {}

  async run() {
    const roles = RolesBuilder.getRoles();

    const changes = roles.map(({ name, permissions, isOrganizationRole }) => {
      return this.repository.findOneAndUpdate(
        { _id: name },
        {
          _id: name,
          name,
          isOrganizationRole,
          permissions: permissions.map((permission) => permission.toString()),
        },
        {
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );
    });

    await Promise.all(changes);
  }
}
