import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plans } from '../../../../subscriptions/data-source/plans.data-source';
import {
  Plan,
  PlanDocument,
} from '../../../../subscriptions/models/plan.model';

@Injectable()
export class PlanSeedService {
  constructor(
    @InjectModel(Plan.name) private repository: Model<PlanDocument>,
  ) {}
  async run() {
    // create plans in app database
    const createPlans = plans.map((plan) => this.createPlan(plan));
    await Promise.all(createPlans);
  }

  async createPlan(plan) {
    return await this.repository.findOneAndUpdate(
      { _id: plan.id },
      {
        _id: plan.id,
        name: plan.name,
        trialPeriodDays: plan.trialPeriodDays,
        defaultQuotas: plan.defaultQuotas,
        requiredProducts: plan.requiredProducts,
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );
  }
}
