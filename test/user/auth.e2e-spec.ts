import * as request from 'supertest';
import { APP_URL, TESTER_EMAIL, TESTER_PASSWORD } from '../utils/constants';

describe('Auth user (e2e)', () => {
  const app = APP_URL;
  const newUserFirstName = `Tester${Date.now()}`;
  const newUserLastName = `E2E`;
  const newUserEmail = `User.${Date.now()}@example.com`;
  const newUserPassword = `secret`;

  it('Login: /auth/login (POST)', () => {
    return request(app)
      .post('/auth/login')
      .send({ email: TESTER_EMAIL, password: TESTER_PASSWORD })
      .expect(200)
      .expect(({ body }) => {
        expect(body.accessToken).toBeDefined();
        expect(body.user.email).toBeDefined();
        expect(body.user.hash).not.toBeDefined();
        expect(body.user.password).not.toBeDefined();
        expect(body.user.previousPassword).not.toBeDefined();
      });
  });

  it('Login via endpoint with extra spaced: /auth/login (POST)', () => {
    return request(app)
      .post('/auth/login')
      .send({ email: TESTER_EMAIL + '  ', password: TESTER_PASSWORD })
      .expect(200);
  });

  it('Do not allow register user with exists email: /auth/email/register (POST)', () => {
    return request(app)
      .post('/auth/email/register')
      .send({
        email: TESTER_EMAIL,
        password: TESTER_PASSWORD,
        firstName: 'Tester',
        lastName: 'E2E',
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.errors.email).toBeDefined();
      });
  });
  let hash;
  it('Register new user: /auth/email/register (POST)', async () => {
    return request(app)
      .post('/auth/email/register')
      .send({
        email: newUserEmail,
        password: newUserPassword,
        firstName: newUserFirstName,
        lastName: newUserLastName,
      })
      .expect(201)
      .expect(({ body }) => {
        if (process.env.NODE_ENV !== 'production') {
          expect(body.hash).toBeDefined();
          hash = body.hash;
        }
      });
  });

  it('Login unconfirmed user: /auth/login (POST)', () => {
    return request(app)
      .post('/auth/login')
      .send({ email: newUserEmail, password: newUserPassword })
      .expect(200)
      .expect(({ body }) => {
        expect(body.accessToken).toBeDefined();
      });
  });
  if (process.env.NODE_ENV !== 'production') {
    it('Confirm email: /auth/email/confirm (POST)', async () => {
      return request(app)
        .post('/auth/email/confirm')
        .send({
          hash,
        })
        .expect(200);
    });
  }

  it('Login confirmed user: /auth/login (POST)', () => {
    return request(app)
      .post('/auth/login')
      .send({ email: newUserEmail, password: newUserPassword })
      .expect(200)
      .expect(({ body }) => {
        expect(body.accessToken).toBeDefined();
        expect(body.user.email).toBeDefined();
      });
  });

  it('Confirmed user retrieve profile: /auth/me (GET)', async () => {
    const newUserApiToken = await request(app)
      .post('/auth/login')
      .send({ email: newUserEmail, password: newUserPassword })
      .then(({ body }) => body.accessToken);

    await request(app)
      .get('/auth/me')
      .auth(newUserApiToken, {
        type: 'bearer',
      })
      .send()
      .expect(({ body }) => {
        expect(body.provider).toBeDefined();
        expect(body.email).toBeDefined();
        expect(body.hash).not.toBeDefined();
        expect(body.password).not.toBeDefined();
        expect(body.previousPassword).not.toBeDefined();
      });
  });

  it('New user update profile: /auth/me (PATCH)', async () => {
    const newUserNewName = Date.now();
    const newUserNewPassword = 'new-secret';
    const newUserApiToken = await request(app)
      .post('/auth/login')
      .send({ email: newUserEmail, password: newUserPassword })
      .then(({ body }) => body.accessToken);

    await request(app)
      .patch('/auth/me')
      .auth(newUserApiToken, {
        type: 'bearer',
      })
      .send({
        firstName: newUserNewName,
        password: newUserNewPassword,
      })
      .expect(422);

    await request(app)
      .patch('/auth/me')
      .auth(newUserApiToken, {
        type: 'bearer',
      })
      .send({
        firstName: newUserNewName,
        password: newUserNewPassword,
        oldPassword: newUserPassword,
      })
      .expect(200);

    await request(app)
      .post('/auth/login')
      .send({ email: newUserEmail, password: newUserNewPassword })
      .expect(200)
      .expect(({ body }) => {
        expect(body.accessToken).toBeDefined();
      });

    await request(app)
      .patch('/auth/me')
      .auth(newUserApiToken, {
        type: 'bearer',
      })
      .send({ password: newUserPassword, oldPassword: newUserNewPassword })
      .expect(200);
  });

  it('New user delete profile: /auth/me (DELETE)', async () => {
    const newUserApiToken = await request(app)
      .post('/auth/login')
      .send({ email: newUserEmail, password: newUserPassword })
      .then(({ body }) => body.accessToken);

    await request(app).delete('/auth/me').auth(newUserApiToken, {
      type: 'bearer',
    });

    return request(app)
      .post('/auth/login')
      .send({ email: newUserEmail, password: newUserPassword })
      .expect(422);
  });
});
