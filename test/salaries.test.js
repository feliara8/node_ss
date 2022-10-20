const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const { expect } = chai;
const Salary = require('../models/salary');
chai.use(chaiHttp);

describe('/salaries', () => {
  var valid_token;

  beforeEach(async function(){
    const params = {
      username: 'test',
      password: 'password'
    };

    const response = await chai.request(app)
      .post('/auth')
      .set('Content-Type', 'application/json')
      .send(params);
    valid_token = response.headers.authorization;
  });

  it('returs error with invalid token', async () => {
    const params = {
      'name': 'Bob Dylan',
      'salary': '180000',
      'currency': 'USD',
      'department': 'Music',
      'sub_department': 'Blues'
    };

    const response = await chai.request(app)
      .post('/salaries')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'invalid_token')
      .send(params);

    expect(response.status).to.eq(500);
    expect(response.text).to.eq('jwt malformed');
  });

  it('creates new salary', async () => {
    const params = {
      'name': 'Bob Dylan',
      'salary': '180000',
      'currency': 'USD',
      'department': 'Music',
      'sub_department': 'Blues'
    };

    const response = await chai.request(app)
      .post('/salaries')
      .set('Content-Type', 'application/json')
      .set('Authorization', valid_token)
      .send(params);

    expect(response.status).to.eq(201);
  });

  it('cannot create new salary without required field', async () => {
    const params = {
      'salary': '180000',
      'currency': 'USD',
      'department': 'Music',
      'sub_department': 'Blues'
    };

    const response = await chai.request(app)
      .post('/salaries')
      .set('Content-Type', 'application/json')
      .set('Authorization', valid_token)
      .send(params);

    expect(response.status).to.eq(400);
  });

  it('deletes a salary', async () => {

    const salary = new Salary({
      'name': 'Bob Dylan',
      'salary': '180000',
      'currency': 'USD',
      'department': 'Music',
      'sub_department': 'Blues'
    });
    const result = await salary.save();

    const response = await chai.request(app)
      .delete(`/salaries/${result.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', valid_token)
      .send();
    expect(response.status).to.eq(200);
  });

  it('cannot delete non-existing salary', async () => {
    const response = await chai.request(app)
      .delete('/salaries/1212434')
      .set('Content-Type', 'application/json')
      .set('Authorization', valid_token)
      .send();
    expect(response.status).to.eq(404);
  });

  it('Get all seeded salaries', async () => {
    const response = await chai.request(app)
      .get('/salaries')
      .set('Content-Type', 'application/json')
      .set('Authorization', valid_token)
      .send();

    expect(response.status).to.eq(200);
    expect(response.body.length).to.eq(9);
  });
});