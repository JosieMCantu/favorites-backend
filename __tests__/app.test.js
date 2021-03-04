require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    

    test('POSTs a new favorites', async() => {
      const newFav = 
        {
          'name': 'new get ok',
          'review_count': 1234,
          'img_url': 'sadfs',
          'rating': 'sdf',
          'yelp_db_id': 'sdfs',
          'owner_id': 2
      };
      const expectation = [
        {
          'id': 4,
          'name': 'new get ok',
          'review_count': 1234,
          'img_url': 'sadfs',
          'rating': 'sdf',
          'yelp_db_id': 'sdfs',
          'owner_id': 2
      }
      ];

      const data = await fakeRequest(app)
        .post('/api/favorites')
        .send(newFav)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('GETs all favorites', async() => {
      
      const expectation = [
        {
          'id': 4,
          'name': 'new get ok',
          'review_count': 1234,
          'img_url': 'sadfs',
          'rating': 'sdf',
          'yelp_db_id': 'sdfs',
          'owner_id': 2
      }
      ];

      const data = await fakeRequest(app)
        .get('/api/favorites')
        .set('Authorization', token)
        // .expect('Content-Type', /json/)
        // .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('DELETEs all favorites', async() => {
      
      const expectation = 
        {};

      const data = await fakeRequest(app)
        .delete('/api/favorites')
        .set('Authorization', token)
        // .expect('Content-Type', /json/)
        // .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
