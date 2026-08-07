import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('QuizzesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
      await app.init();
    } catch (e) {
      console.error('App init failed', e);
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/quizzes (POST)', async () => {
    if (!app) return;
    await request(app.getHttpServer() as App)
      .post('/quizzes')
      .send({
        title: 'Test Quiz',
        questions: [
          {
            type: 'BOOLEAN',
            text: 'Is this a test?',
            options: [
              { text: 'Yes', isCorrect: true },
              { text: 'No', isCorrect: false },
            ],
          },
        ],
      })
      .expect(201);
  });

  it('/quizzes (GET)', async () => {
    if (!app) return;
    const response = await request(app.getHttpServer() as App)
      .get('/quizzes')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});
