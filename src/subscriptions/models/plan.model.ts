import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlanDocument = HydratedDocument<Plan>;

@Schema({
  timestamps: true,
})
export class Plan {
  @Prop({ type: Number, isRequired: true, index: true })
  _id: number;

  @Prop({ isRequired: false, index: true })
  name: string | null;

  @Prop({ type: Number, isRequired: false })
  trialPeriodDays: number;

  @Prop({
    type: Object,
  })
  planMetadata: any;

  @Prop({
    type: Object,
  })
  requiredProducts: any;

  @Prop({
    type: Object,
  })
  defaultQuotas: any;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);

export const PlanFactory: ModelDefinition = {
  name: Plan.name,
  schema: PlanSchema,
};
