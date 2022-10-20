const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const { expect } = chai;
chai.use(chaiHttp);

describe('/auth', () => {
  it('creates a new token', async () => {
    const params = {
      username: 'test',
      password: 'password'
    };

    const response = await chai.request(app)
      .post('/auth')
      .set('Content-Type', 'application/json')
      .send(params);

    expect(response.status).to.eq(201);
    expect(response.headers.authorization !== undefined).to.eq(true);
  });

  it('it does not create a new token with incorrect credentials', async () => {
    const params = {
      username: 'test',
      password: 'password1'
    };

    const response = await chai.request(app)
      .post('/auth')
      .set('Content-Type', 'application/json')
      .send(params);

    expect(response.status).to.eq(400);
    expect(response.headers.authorization === undefined).to.eq(true);
  });
});