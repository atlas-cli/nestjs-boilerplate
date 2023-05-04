import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './../../models/user.model';

export type OrganizationDocument = HydratedDocument<Organization>;

@Schema({
  timestamps: true,
})
export class Organization {
  _id: Types.ObjectId;

  @Prop({ isRequired: true, index: true })
  name: string;

  @Prop({ isRequired: true, index: true })
  email: string;

  @Prop({ type: Types.ObjectId, ref: User.name, isRequired: true, index: true })
  owner: Types.ObjectId;

  @Prop({ isRequired: false, index: true })
  stripeCustomerId: string | null;

  plan: number;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

export const OrganizationFactory: ModelDefinition = {
  name: Organization.name,
  schema: OrganizationSchema,
};
