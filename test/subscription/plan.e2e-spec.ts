import * as request from 'supertest';
import { APP_URL, TESTER_EMAIL, TESTER_PASSWORD } from '../utils/constants';

describe('Plan test (e2e)', () => {
  const app = APP_URL;
  let accessToken: string;

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

  it('shoud be list all plans avaiable', () => {
    return request(app)
      .get('/subscriptions/plans')
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data).toBeDefined();
        expect(body.hasNextPage).toBeDefined();
        expect(body.products).toBeDefined();
      });
  });
});
