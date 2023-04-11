import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({
  timestamps: true,
})
export class Role {
  @Prop({ type: String, isRequired: true, index: true })
  _id: string;

  @Prop({ isRequired: true, index: true })
  name: string;

  @Prop({ isRequired: true, index: true })
  permissions: any[];

  @Prop({ isRequired: true })
  isDynamic: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
export const RoleFactory: ModelDefinition = {
  name: Role.name,
  schema: RoleSchema,
};
