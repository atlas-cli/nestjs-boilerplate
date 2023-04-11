import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from './../../common/roles/models/role.model';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class UserRoleRelation {
  @Prop({ type: String, ref: Role.name, isRequired: true, index: true })
  role: string;

  @Prop({ type: Types.ObjectId, isRequired: false, index: true })
  organizationId?: Types.ObjectId;

  @Prop({ isRequired: false, index: true })
  permissions?: string[];
}

export const UserRoleRelationSchema =
  SchemaFactory.createForClass(UserRoleRelation);
