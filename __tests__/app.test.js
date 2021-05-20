import client from '../lib/client.js';
import supertest from 'supertest';
import app from '../lib/app.js';
import { execSync } from 'child_process';
// import { formatSquirrels } from '../utils/munge-utils.js';


const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('favorites', () => {
    let user;
    let user2;

    beforeAll(async () => {
      execSync('npm run recreate-tables');


      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Me the User',
          email: 'me@user.com',
          password: 'password'
        });

      expect(response.status).toBe(200);

      user = response.body;


    });

    let favorite = {
      'hectare': '02I',
      'shift': 'AM',
      'date': '10062018',
      'stories': 'Busy area, with heavy car traffic and lots of dog and human traffic and a high level of birds (making tree spotting difficult).',
      'experience': true,
      'poems': true,
    };


    test('GET my /api/favorites', async () => {
      const postResponse = await request
        .post('/api/favorites')
        .set('Authorization', user.token)
        .send(favorite);
      const response = await request
        .get('/api/me/favorites')
        .set('Authorization', user.token);
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ ...postResponse.body, id: 1 }]);

    });

    test('POST /api/me/favorites', async () => {

      const response = await request
        .post('/api/favorites')
        .set('Authorization', user.token)
        .send(favorite);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        userId: user.id, ...favorite
      });

      favorite = response.body;
    });

    test('GET /api/me/favorites', async () => {
      const otherResponse = await request
        .post('/api/favorites')
        .set('Authorization', user2.token)
        .send({
          'hectare': '02I',
          'shift': 'AM',
          'date': '10062018',
          'stories': 'Busy area, with heavy car traffic and lots of dog and human traffic and a high level of birds (making tree spotting difficult).',
          'experience': true,
          'poems': true,
        });

      expect(otherResponse.status).toBe(200);
      const otherFavorite = otherResponse.body;

      const response = await request.get('/api/me/favorites')
        .set('Authorization', user.token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.not.arrayContaining([otherFavorite]));

      const response2 = await request.get('/api/me/favorites')
        .set('Authorization', user2.token);

      expect(response2.status).toBe(200);
      expect(response2.body).toEqual([otherFavorite]);

    });
  });
});