import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Organization } from './../../users/organizations/models/organization.model';
import { SubscriptionStatus } from './../../subscriptions/enums/subscription-status.enum';
import { Plan } from './plan.model';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({
  timestamps: true,
})
export class Subscription {
  _id: Types.ObjectId;

  @Prop({ type: String, isRequired: true, index: true })
  stripeSubscriptionId: string;

  @Prop({ type: Number, ref: Plan.name, isRequired: true, index: true })
  plan: number;

  @Prop({
    type: Types.ObjectId,
    ref: Organization.name,
    isRequired: true,
    index: true,
  })
  organization: Types.ObjectId;

  @Prop({
    type: Object,
  })
  quotas: {
    students: number;
    classroom: number;
    recording: number;
    storage: number;
    teachers: number;
  };

  @Prop({ enum: SubscriptionStatus, default: SubscriptionStatus.incomplete })
  status: string;

  @Prop({ type: Boolean, default: false })
  cancelAtPeriodEnd: boolean;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

export const SubscriptionFactory: ModelDefinition = {
  name: Subscription.name,
  schema: SubscriptionSchema,
};
