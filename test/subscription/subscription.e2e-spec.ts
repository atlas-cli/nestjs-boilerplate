import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { APP_URL, TESTER_EMAIL, TESTER_PASSWORD } from '../utils/constants';
import { StripeSharedModule } from './../../src/subscriptions/webhooks/stripe/stripe.module';
import { SharedModule } from './../../src/shared/shared.module';
import Stripe from 'stripe';
import { STRIPE_CLIENT_TOKEN } from '@golevelup/nestjs-stripe';

describe('Subscription tests (e2e)', () => {
  const app = APP_URL;
  const ORGANIZATION_NAME = 'Teacher Organization';
  const ORGANIZATION_EMAIL = `organization.${Date.now()}@example.com`;

  let accessToken: string;
  let organizationId: string;
  let subscriptionId: string;

  let stripeClient: Stripe;
  let paymentIntentId: string;

  it('login: /auth/login (POST)', () => {
    return request(app)
      .post('/auth/login')
      .send({ email: TESTER_EMAIL, password: TESTER_PASSWORD })
      .expect(200)
      .expect(({ body }) => {
        expect(body.accessToken).toBeDefined();
        accessToken = body.accessToken;
        expect(body.user.email).toBeDefined();
        expect(body.user.hash).not.toBeDefined();
        expect(body.user.password).not.toBeDefined();
        expect(body.user.previousPassword).not.toBeDefined();
      });
  });

  it('user should be create a organization (POST)', () => {
    return request(app)
      .post('/users/organizations')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        name: ORGANIZATION_NAME,
        email: ORGANIZATION_EMAIL,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body._id).toBeDefined();
        expect(body.name).toBe(ORGANIZATION_NAME);
        organizationId = body._id;
      });
  });

  it('should be able to create a free subscription without quantities (POST)', () => {
    return request(app)
      .post('/subscriptions/create')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        planId: 0,
        organizationId,
        currency: 'brl',
        interval: 'month',
        products: [],
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('should be an active free subscription for this organization', () => {
    return request(app)
      .get('/subscriptions/active/' + organizationId)
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body._id).toBeDefined();
        subscriptionId = body._id;
        expect(body.plan).toBeDefined();
        expect(body.status).toBe('active');
      });
  });

  it('should not be able to cancel a free subscription', () => {
    return request(app)
      .delete('/subscriptions/cancel')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        subscriptionId,
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.message).toBe('you cannot cancel free subscription');
      });
  });

  it('should not be able to create another free subscription', () => {
    return request(app)
      .post('/subscriptions/create')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        planId: 0,
        organizationId,
        currency: 'brl',
        interval: 'month',
        products: [],
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.message).toBe(
          'you already have an active free subscription',
        );
      });
  });

  it('user should be create a other organization for a pro plan (POST)', () => {
    return request(app)
      .post('/users/organizations')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        name: ORGANIZATION_NAME,
        email: ORGANIZATION_EMAIL,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body._id).toBeDefined();
        expect(body.name).toBe(ORGANIZATION_NAME);
        organizationId = body._id;
      });
  });

  it('should not be able to create a subscription in the professional plan without products', () => {
    return request(app)
      .post('/subscriptions/create')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        planId: 1,
        currency: 'brl',
        interval: 'month',
        products: [],
      })
      .expect(422);
  });

  it('create an invoice that will not be paid and will be canceled due to the next subscription', () => {
    return request(app)
      .post('/subscriptions/create')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        planId: 1,
        organizationId,
        currency: 'brl',
        interval: 'month',
        products: [
          { id: 'professional' },
          { id: 'students', quantity: 10 },
          { id: 'classroom', quantity: 5 },
          { id: 'storage', quantity: 5 },
        ],
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.subscriptionId).toBeDefined();
        expect(body.clientSecret).toBeDefined();
      });
  });

  it('should be able to create a subscription with quantities for a pro plan (POST)', () => {
    return request(app)
      .post('/subscriptions/create')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        planId: 1,
        organizationId,
        currency: 'brl',
        interval: 'month',
        products: [
          { id: 'professional' },
          { id: 'students', quantity: 10 },
          { id: 'classroom', quantity: 5 },
          { id: 'storage', quantity: 5 },
        ],
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.subscriptionId).toBeDefined();
        expect(body.clientSecret).toBeDefined();
        paymentIntentId = body.paymentIntent;
      });
  });

  it('setup stripe client and make subscription paid', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, StripeSharedModule],
    }).compile();

    stripeClient = module.get<Stripe>(STRIPE_CLIENT_TOKEN);
    await stripeClient.paymentIntents.confirm(paymentIntentId, {
      payment_method: 'pm_card_visa',
    });
  });

  it('wait 2 seconds to webhook active a plan', async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  it('should be an active subscription for this organization', () => {
    return request(app)
      .get('/subscriptions/active/' + organizationId)
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body._id).toBeDefined();
        subscriptionId = body._id;
        expect(body.plan).toBeDefined();
        expect(body.status).toBe('active');
        expect(body.quotas.students).toBe(10);
        expect(body.quotas.classroom).toBe(5);
        expect(body.quotas.storage).toBe(5);
      });
  });
  it('should not be able to create a pro subscription as it already exists (POST)', () => {
    return request(app)
      .post('/subscriptions/create')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        planId: 1,
        organizationId,
        currency: 'brl',
        interval: 'month',
        products: [
          { id: 'professional' },
          { id: 'students', quantity: 10 },
          { id: 'classroom', quantity: 5 },
          { id: 'storage', quantity: 5 },
        ],
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.message).toBe(
          'you already have an active subscription please make update',
        );
      });
  });

  it('should be able to cancel a subscription', () => {
    return request(app)
      .delete('/subscriptions/cancel')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        subscriptionId,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('should be able to update a subscription and reativate subscription (POST)', () => {
    return request(app)
      .put('/subscriptions/update')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        planId: 2,
        organizationId,
        currency: 'brl',
        interval: 'month',
        products: [
          { id: 'organization' },
          { id: 'students', quantity: 20 },
          { id: 'teachers', quantity: 5 },
          { id: 'classroom', quantity: 20 },
          { id: 'recording', quantity: 1 },
          { id: 'storage', quantity: 5 },
        ],
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('wait 2 seconds to webhook active a plan', async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  it('must have a property indicating that it will be not canceled in the next period becouse has update', () => {
    return request(app)
      .get('/subscriptions/active/' + organizationId)
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.cancelAtPeriodEnd).toBe(false);
      });
  });

  it('should be able to cancel a subscription', () => {
    return request(app)
      .delete('/subscriptions/cancel')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        subscriptionId,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('wait 2 seconds to webhook active a plan', async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  it('must have a property indicating that it will be canceled in the next period', () => {
    return request(app)
      .get('/subscriptions/active/' + organizationId)
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.cancelAtPeriodEnd).toBe(true);
      });
  });

  it('user should be create a other organization for a organization plan (POST)', () => {
    return request(app)
      .post('/users/organizations')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        name: ORGANIZATION_NAME,
        email: ORGANIZATION_EMAIL,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body._id).toBeDefined();
        expect(body.name).toBe(ORGANIZATION_NAME);
        organizationId = body._id;
      });
  });

  it('should be able to create a subscription with quantities for a organization plan (POST)', () => {
    return request(app)
      .post('/subscriptions/create')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        planId: 2,
        organizationId,
        currency: 'brl',
        interval: 'month',
        products: [
          { id: 'organization' },
          { id: 'students', quantity: 10 },
          { id: 'teachers', quantity: 5 },
          { id: 'classroom', quantity: 5 },
          { id: 'recording', quantity: 5 },
          { id: 'storage', quantity: 5 },
        ],
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.subscriptionId).toBeDefined();
        // expect(body.clientSecret).toBeDefined();
        paymentIntentId = body.paymentIntent;
      });
  });

  it('should be an trailing subscription for this organization', () => {
    return request(app)
      .get('/subscriptions/active/' + organizationId)
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body._id).toBeDefined();
        subscriptionId = body._id;
        expect(body.plan).toBeDefined();
        expect(body.status).toBe('trialing');
        expect(body.quotas.students).toBe(10);
        expect(body.quotas.classroom).toBe(5);
        expect(body.quotas.recording).toBe(body.quotas.classroom);
        expect(body.quotas.storage).toBe(5);
        expect(body.quotas.teachers).toBe(5);
      });
  });

  it('should be able to update a subscription with quantities for a organization plan (POST)', () => {
    return request(app)
      .put('/subscriptions/update')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        planId: 2,
        organizationId,
        currency: 'brl',
        interval: 'month',
        products: [
          { id: 'organization' },
          { id: 'students', quantity: 20 },
          { id: 'teachers', quantity: 5 },
          { id: 'classroom', quantity: 20 },
          { id: 'recording', quantity: 1 },
          { id: 'storage', quantity: 5 },
        ],
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('should be able to create checkout sesseion', () => {
    return request(app)
      .post('/subscriptions/session')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        organizationId,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('should not be able to update a subscription in trial to pro plan', () => {
    return request(app)
      .put('/subscriptions/update')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        planId: 1,
        organizationId,
        currency: 'brl',
        interval: 'month',
        products: [
          { id: 'professional' },
          { id: 'students', quantity: 20 },
          { id: 'classroom', quantity: 5 },
          { id: 'recording', quantity: 0 },
          { id: 'storage', quantity: 5 },
        ],
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('should be able to cancel a subscription', () => {
    return request(app)
      .delete('/subscriptions/cancel')
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({
        subscriptionId,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('wait 2 seconds to webhook active a plan', async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  it('subscription trial is cancelled immediately', () => {
    return request(app)
      .get('/subscriptions/active/' + organizationId)
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(404);
  });
});
