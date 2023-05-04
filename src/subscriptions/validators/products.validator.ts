import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { plans } from '../data-source/plans.data-source';

@ValidatorConstraint({ name: 'products', async: false })
export class ProductsValidator implements ValidatorConstraintInterface {
  validate(products: any[], args: ValidationArguments) {
    if (products === undefined) {
      return true;
    }
    const createSubscriptionDto = args.object as CreateSubscriptionDto;
    const planId = createSubscriptionDto.planId;

    const plan = plans.find((plan) => plan.id === planId);
    if (!plan) return false;

    const requiredProducts = plan.requiredProducts;

    for (const rq of requiredProducts) {
      const pq = products.find((q) => q.id === rq);
      if (!pq) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const createSubscriptionDto = args.object as CreateSubscriptionDto;
    const planId = createSubscriptionDto.planId;
    return `Plan "${planId}" requires ${this.getRequiredProducts(planId)}.`;
  }

  private getRequiredProducts(planId: number): string {
    const plan = plans.find((plan) => plan.id === planId);
    if (!plan) return '';

    console.log(plan.requiredProducts);
    return plan.requiredProducts.join(', ');
  }
}
