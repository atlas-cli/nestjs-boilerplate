import * as request from 'supertest';
import { APP_URL, TESTER_EMAIL, TESTER_PASSWORD } from '../utils/constants';

describe('Organization test (e2e)', () => {
  const app = APP_URL;
  let accessToken: string;
  let organizationId: string;
  const ORGANIZATION_NAME = 'Teacher Organization';
  const ORGANIZATION_EMAIL = `organization.${Date.now()}@example.com`;
  const ORGANIZATION_NEW_NAME = 'User New Organization';

  it('Login: /auth/login (POST)', () => {
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

  it('User should be create a organization (POST)', () => {
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

  it('User should be list organizations (GET)', () => {
    return request(app)
      .get('/users/organizations/')
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data).toBeDefined();
        expect(body.data[0].name).toBeDefined();
      });
  });

  it('User should be get one organization by id (GET)', () => {
    return request(app)
      .get('/users/organizations/' + organizationId)
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.name).toBe(ORGANIZATION_NAME);
      });
  });

  it('User should be update one organization by id (PATCH)', () => {
    return request(app)
      .patch('/users/organizations/' + organizationId)
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({ name: ORGANIZATION_NEW_NAME })
      .expect(200);
  });

  it('User should be get one organization by id and have new name (GET)', () => {
    return request(app)
      .get('/users/organizations/' + organizationId)
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.name).toBe(ORGANIZATION_NEW_NAME);
      });
  });

  it('User should be delete a organization by id (DELETE)', () => {
    return request(app)
      .delete('/users/organizations/' + organizationId)
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(200);
  });
});
