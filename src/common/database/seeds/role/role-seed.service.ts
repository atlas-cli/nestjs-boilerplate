import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './../../../roles/models/role.model';
import { RolesDataSource } from './../../../roles/roles.data-source';
import { Model } from 'mongoose';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectModel(Role.name) private repository: Model<RoleDocument>,
  ) {}

  async run() {
    const roles = RolesDataSource.getRoles();

    const changes = roles.map(({ name, permissions, isDynamic }) => {
      return this.repository.findOneAndUpdate(
        { _id: name },
        {
          _id: name,
          name,
          isDynamic,
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
