import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Define a type alias for the document type of the Role model
export type RoleDocument = HydratedDocument<Role>;

// Define the schema for the Role model
@Schema({
  timestamps: true,
})
export class Role {
  // The ID of the role in this case im not ussing objectid
  @Prop({ type: String, isRequired: true, index: true })
  _id: string;

  // The name of the role
  @Prop({ isRequired: true, index: true })
  name: string;

  // The permissions associated with the role
  @Prop({ isRequired: true, index: true })
  permissions: any[];

  // Whether the role is a organization role
  @Prop({ isRequired: true })
  isOrganizationRole: boolean;
}

// Create the mongoose schema for the Role model
export const RoleSchema = SchemaFactory.createForClass(Role);

// Define the model definition object for the Role model
export const RoleFactory: ModelDefinition = {
  name: Role.name,
  schema: RoleSchema,
};
