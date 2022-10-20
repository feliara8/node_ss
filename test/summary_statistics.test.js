const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const { expect } = chai;
chai.use(chaiHttp);

describe('/summary_statistics', () => {
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
      .post('/summary_statistics')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'invalid_token')
      .send(params);

    expect(response.status).to.eq(500);
    expect(response.text).to.eq('jwt malformed');
  });

  it('get summary statistics', async () => {
    const response = await chai.request(app)
      .get('/summary_statistics')
      .set('Content-Type', 'application/json')
      .set('Authorization', valid_token)
      .send();

    expect(response.status).to.eq(200);
    expect(response.body[0].min).to.eq(30);
    expect(response.body[0].max).to.eq(200000000);
    expect(response.body[0].mean).to.eq(22295010);
  });

  it('get summary statistics only for on contracts', async () => {
    const response = await chai.request(app)
      .get('/summary_statistics?on_contract=true')
      .set('Content-Type', 'application/json')
      .set('Authorization', valid_token)
      .send();

    expect(response.status).to.eq(200);
    expect(response.body[0].min).to.eq(90000);
    expect(response.body[0].max).to.eq(110000);
    expect(response.body[0].mean).to.eq(100000);
  });

  it('get summary statistics by departments', async () => {
    const response = await chai.request(app)
      .get('/summary_statistics/by_department')
      .set('Content-Type', 'application/json')
      .set('Authorization', valid_token)
      .send();

    expect(response.status).to.eq(200);
    expect(response.body[0].department).to.eq('Administration');
    expect(response.body[0].min).to.eq(30);
    expect(response.body[0].max).to.eq(30);
    expect(response.body[0].mean).to.eq(30);
    expect(response.body[1].department).to.eq('Banking');
    expect(response.body[1].min).to.eq(90000);
    expect(response.body[1].max).to.eq(90000);
    expect(response.body[1].mean).to.eq(90000);
    expect(response.body[2].department).to.eq('Engineering');
    expect(response.body[2].min).to.eq(30);
    expect(response.body[2].max).to.eq(200000000);
    expect(response.body[2].mean).to.eq(40099006);
    expect(response.body[3].department).to.eq('Operations');
    expect(response.body[3].min).to.eq(30);
    expect(response.body[3].max).to.eq(70000);
    expect(response.body[3].mean).to.eq(35015);
  });

  it('get summary statistics by departments and subdepartments', async () => {
    const response = await chai.request(app)
      .get('/summary_statistics/by_department_and_sub_department')
      .set('Content-Type', 'application/json')
      .set('Authorization', valid_token)
      .send();

    expect(response.status).to.eq(200);
    expect(response.body[0].department).to.eq('Administration');
    expect(response.body[0].sub_department).to.eq('Agriculture');
    expect(response.body[0].min).to.eq(30);
    expect(response.body[0].max).to.eq(30);
    expect(response.body[0].mean).to.eq(30);
    expect(response.body[1].department).to.eq('Banking');
    expect(response.body[1].sub_department).to.eq('Loan');
    expect(response.body[1].min).to.eq(90000);
    expect(response.body[1].max).to.eq(90000);
    expect(response.body[1].mean).to.eq(90000);
    expect(response.body[2].department).to.eq('Engineering');
    expect(response.body[2].sub_department).to.eq('Platform');
    expect(response.body[2].min).to.eq(30);
    expect(response.body[2].max).to.eq(200000000);
    expect(response.body[2].mean).to.eq(40099006);
    expect(response.body[3].department).to.eq('Operations');
    expect(response.body[3].sub_department).to.eq('CustomerOnboarding');
    expect(response.body[3].min).to.eq(30);
    expect(response.body[3].max).to.eq(70000);
    expect(response.body[3].mean).to.eq(35015);
  });

});