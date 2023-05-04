import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
})
export class Product {
  _id: Types.ObjectId;

  @Prop({ isRequired: true, index: true })
  name: string;

  @Prop({ isRequired: true, index: true })
  type: string;

  @Prop({ type: String, isRequired: true, index: true })
  stripeProductId: string;

  @Prop({ type: Object, isRequired: true })
  prices: any;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export const ProductFactory: ModelDefinition = {
  name: Product.name,
  schema: ProductSchema,
};
