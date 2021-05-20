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

    test('GET my /api/squirrel-sightings', async () => {

      const getSquirrelResponse = await request
        .post('/api/squirrel-sightings')
        .set('Authorization', user.token)
        .send({
          'hectare': '02I',
          'shift': 'AM',
          'date': '10062018',
          'stories': 'Busy area, with heavy car traffic and lots of dog and human traffic and a high level of birds (making tree spotting difficult).',
          'experience': true,
          'animals': true,
          'other': 'Birds',
          'poems': true,
        });

      expect(getSquirrelResponse.status).toBe(200);
      const story = getSquirrelResponse.body;
      console.log(story);
      const response = await request.get('/api/squirrel-sightings')
        .set('Authorization', user.token);

      expect(response.status).toBe(200);
      expect(response.body).toBe([story]);
    });

  });
});

