import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { randomUser } from '../src/shared/test/user.mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let siteId: string;
  const rmUser = randomUser();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: rmUser.email, password: rmUser.password })
      .expect(201)
      .then(res => {
        token = res.body.access_token;
      });
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: rmUser.email, password: rmUser.password })
      .expect(201)
      .then(res => {
        token = res.body.access_token;
      });
  });

  it('/tracking-code (GET)', () => {
    return request(app.getHttpServer())
      .get('/tracking-code')
      .expect(200)
      .then(res => {
        expect(res.body).toHaveProperty('code');
      });
  });

  it('/site (POST)', () => {
    return request(app.getHttpServer())
      .post('/site')
      .send({ name: 'test', url: 'test.com' })
      .set('Authorization', 'Bearer ' + token)
      .expect(201)
      .then(res => {
        siteId = res.body._id;
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('url');
      });
  });

  it('/site (GET)', () => {
    return request(app.getHttpServer())
      .get(`/site/${siteId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(res => {
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('url');
        expect(res.body).toHaveProperty('userId');
        expect(res.body).toHaveProperty('createdAt');
      });
  });
  it('/site (GET) Not Found', () => {
    return request(app.getHttpServer())
      .get('/site/1')
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });
});
