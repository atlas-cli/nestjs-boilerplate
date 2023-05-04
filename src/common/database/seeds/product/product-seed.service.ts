import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { products } from '../../../../subscriptions/data-source/products.data-source';
import {
  Product,
  ProductDocument,
} from '../../../../subscriptions/models/product.model';

/**
 * Creates an instance of ProductSeedService.
 * @param {Model<ProductDocument>} repository - The product repository.
 * @param {Stripe} stripeClient - The Stripe client.
 */
@Injectable()
export class ProductSeedService {
  constructor(
    @InjectModel(Product.name) private repository: Model<ProductDocument>,
    @InjectStripeClient() private stripeClient: Stripe,
  ) {}

  /**
   * Seeds the database with products and prices.
   */
  async run(): Promise<void> {
    // create products
    const createProducts = products.map((product) =>
      this.createProduct(product),
    );
    await Promise.all(createProducts);
  }

  /**
   * Creates or updates a product on Stripe.
   * @param {Object} product - The product object to create or update.
   */
  async createProduct(product: any): Promise<Stripe.Product> {
    const prices = await this.createOrUpdateProductOnStripe(product);
    product.prices = product.prices.map((price, i) => ({
      id: prices[price.type],
      ...price,
    }));
    return await this.repository.findOneAndUpdate(
      { stripeProductId: product.id },
      {
        stripeProductId: product.id,
        name: product.name,
        type: product.type,
        prices: product.prices,
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  /**
   * Creates or updates a product on Stripe.
   * @param {Object} product - The product object to create or update.
   */
  async createOrUpdateProductOnStripe(
    product: any,
  ): Promise<{ month: string; year: string }> {
    let prices;
    if (await this.findProductAlreadyExists(product.id)) {
      await this.stripeClient.products.update(product.id, {
        name: product.name,
      });
      prices = await this.findProductPrices(product.id);
    } else {
      await this.stripeClient.products.create({
        id: product.id,
        name: product.name,
      });
      prices = await this.createProductPricesOnStripe(product);
    }
    return prices.reduce(
      (prev, price) => ({ ...prev, [price.recurring.interval]: price.id }),
      {},
    );
  }

  /**
   * Creates or updates product prices on Stripe.
   * @param {Object} product - The product object containing prices to create or update.
   */
  async createProductPricesOnStripe(product: any): Promise<Stripe.Price[]> {
    const createPrices = product.prices.map((price) =>
      this.createPriceOnStripe(product.id, product.type, price),
    );
    return await Promise.all(createPrices);
  }

  /**
   * Checks if a product already exists on Stripe.
   * @param {string} id - The product ID to check.
   */
  async findProductAlreadyExists(id: string): Promise<boolean> {
    try {
      await this.stripeClient.products.retrieve(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * list a a product prices.
   * @param {string} id - The product ID to find and list.
   */
  async findProductPrices(id: string) {
    try {
      const { data } = await this.stripeClient.prices.list({
        product: id,
      });
      return data;
    } catch (error) {
      return false;
    }
  }

  /**
   * Creates a price on Stripe.
   * @param {string} productId - The product ID for the price.
   * @param {'volume' | 'standard'} priceType - The type of price (volume or standard).
   * @param {Object} price - The price object to create.
   */
  async createPriceOnStripe(
    productId: string,
    priceType: 'volume' | 'standard',
    price: any,
  ) {
    if (priceType === 'standard') {
      const standardPrice: Stripe.PriceCreateParams = {
        product: productId,
        currency: 'brl',
        unit_amount: price.currencies.brl,
        recurring: { interval: price.type },
        currency_options: {
          usd: { unit_amount: price.currencies.usd },
        },
      };
      return await this.stripeClient.prices.create(standardPrice);
    }

    if (priceType === 'volume') {
      const buildTier = (tier) => ({
        flat_amount: tier.amount,
        up_to: tier.quantity !== null ? tier.quantity : 'inf',
      });

      const tiers = price.currencies.brl.map(buildTier);
      const tiersUsd = price.currencies.usd.map(buildTier);
      const volumePrice: Stripe.PriceCreateParams = {
        product: productId,
        tiers,
        tiers_mode: 'volume',
        billing_scheme: 'tiered',
        expand: ['tiers'],
        currency: 'brl',
        recurring: { interval: price.type },
        currency_options: {
          usd: { tiers: tiersUsd },
        },
      };
      return await this.stripeClient.prices.create(volumePrice);
    }
  }
}
