import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { randomUser } from '../src/shared/test/user.mock';
import { CreateCampaignDto } from '../src/campaign/dto/create-campaign.dto';
import * as mongoose from 'mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let siteId: string;
  let trackingCode: any;
  let campaign: any;
  const rmUser = randomUser();
  //todo: each test must be independent from others

  beforeAll(async () => {
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
        trackingCode = res.body;
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

  it('/site/:id (GET)', () => {
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
  it('/site/:id (GET) Not Found', () => {
    const siteId = mongoose.Types.ObjectId('56cb91bdc3464f14678934ca');
    return request(app.getHttpServer())
      .get(`/site/${siteId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });

  it('/site (GET) ', () => {
    return request(app.getHttpServer())
      .get('/site')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: expect.any(String),
              url: expect.any(String),
            }),
          ]),
        );
      });
  });

  it('/site?perPage=2&page=1 (GET) ', () => {
    return request(app.getHttpServer())
      .get('/site?perPage=2&page=1')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: expect.any(String),
              url: expect.any(String),
            }),
          ]),
        );
      });
  });

  it('/site/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put(`/site/${siteId}`)
      .set('Authorization', 'Bearer ' + token)
      .send({ name: 'test2', url: 'test2.com' })
      .expect(204);
  });

  it('/site/:id (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete(`/site/${siteId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  it('/campaign (POST)', () => {
    const createCampaignDto: CreateCampaignDto = {
      name: 'new_camp',
      title: 'say more?',
      subtitle: 'is that is good?',
      thanks_message: 'thanks',
      allow_rating: true,
      require_rating: true,
      allow_full_name: false,
      allow_mobile: false,
      allow_comment: false,
      allow_email: false,
      type: 'feedback',
      siteId: siteId,
    };
    return request(app.getHttpServer())
      .post('/campaign')
      .set('Authorization', 'Bearer ' + token)
      .expect(201)
      .send(createCampaignDto)
      .then(res => {
        expect(res.body).toHaveProperty('title');
        campaign = res.body;
      });
  });

  it('/response/stat (POST)', async () => {
    return request(app.getHttpServer())
      .post('/response/stat')
      .send({
        siteId: siteId,
        campId: campaign._id,
        trackingCode: trackingCode.code,
      })
      .expect(200)
      .then(res => {
        expect(res.body).toBeTruthy();
      });
  });

  it('/response/stat (POST)', async () => {
    return request(app.getHttpServer())
      .post('/response/stat')
      .send({
        siteId: siteId,
        campId: campaign._id,
        trackingCode: '',
      })
      .expect(200)
      .then(res => {
        expect(res.body).toBeTruthy();
      });
  });
});
