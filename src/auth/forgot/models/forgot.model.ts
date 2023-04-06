import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes, Types } from 'mongoose';
import { Allow } from 'class-validator';
import { Exclude } from 'class-transformer';

export type ForgotDocument = HydratedDocument<Forgot>;

@Schema({
  timestamps: true,
})
export class Forgot {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: ObjectId;

  @Prop({ isRequired: true, index: true })
  @Exclude({ toPlainOnly: true })
  hash: string | null;

  @Allow()
  @Prop({
    isRequired: true,
    index: true,
  })
  userId: Types.ObjectId;
}

export const ForgotSchema = SchemaFactory.createForClass(Forgot);
export const ForgotFactory: ModelDefinition = {
  name: Forgot.name,
  schema: ForgotSchema,
};
