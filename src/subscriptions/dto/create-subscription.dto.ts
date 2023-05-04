import { IsString, IsNotEmpty, IsEnum, IsInt, Validate } from 'class-validator';
import { ProductsValidator } from '../validators/products.validator';

export class CreateSubscriptionDto {
  @IsInt()
  @IsNotEmpty()
  planId: number;

  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @IsEnum(['usd', 'brl'])
  @IsNotEmpty()
  currency: 'usd' | 'brl';

  @IsEnum(['year', 'month'])
  @IsNotEmpty()
  interval: 'year' | 'month';

  @IsNotEmpty()
  @Validate(ProductsValidator)
  products: Product[];
}

export class Product {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsInt()
  quantity?: number;
}
