const Salary = require('../models/salary');
const _ = require('lodash');

function whitelistedParams(params) {
  // accept only following parameters
  return _.pick(params, 'id', 'name', 'salary', 'currency', 'department', 'sub_department', 'on_contract');
}

async function safeExecute(req, _res, next, method) {
  try {
    await method({ bodyParams: whitelistedParams(req.body), query: whitelistedParams(req.query), params: req.params });
  }
  catch(error) {
    next(error);
  }
}

function validateRequiredSalaryFields(res, bodyParams){
  const { name, salary, currency, department, sub_department } = bodyParams;
  if (!name || !salary || !currency || !department || !sub_department) {
    const err = new Error();
    err.code = 400;
    err.message = 'Missing required fields';
    throw err;
  }
}

const salariesController = {
  addSalary: async (req, res, next) => {
    safeExecute(req, res, next, async ({ bodyParams }) => {
      validateRequiredSalaryFields(res, bodyParams);
      const sal = new Salary(bodyParams);
      const result = await sal.save();
      res.status(201);
      res.send(result);
    });
  },
  findSalaries: async (req, res, next) => {
    safeExecute(req, res, next, async ({ query }) => {
      const result = await Salary.findAll({
        where: query
      });
      res.status(200);
      res.send(result);
    });
  },
  updateSalary: async (req, res, next) => {
    safeExecute(req, res, next, async ({ bodyParams, params }) => {
      const result = await Salary.update(bodyParams, { where: { id: params.id } });
      if(result[0] === 1) {
        res.status(200);
        res.send(result);
      }
      else {
        res.status(404);
        res.send('Not Found');
      }
    });
  },
  findSalaryById: async (req, res, next) => {
    safeExecute(req, res, next, async ({ params }) => {
      const result = await Salary.findByPk(params.id);
      if(result !== null) {
        res.status(200);
        res.send(result);
      }
      else {
        res.status(404);
        res.send('Not Found');
      }
    });
  },
  deleteSalaryById: async (req, res, next) => {
    safeExecute(req, res, next, async ({ params }) => {
      const result = await Salary.destroy({ where: { id: params.id } });
      if(result === 1) {
        res.status(200);
        res.send('Salary Deleted');
      }
      else {
        res.status(404);
        res.send('Not Found');
      }
    });
  },
  summaryStatistics: async (req, res, next) => {
    console.log('dfdfdfd');
    safeExecute(req, res, next, async ({ query }) => {
      console.log(query);
      console.log('hola');
      const result = await Salary.findAll({
        where: query
      });

      const sum = _.sumBy(result, function(salary) { return salary.salary; }); 
      res.status(200);
      res.send(sum);
    });
  },
};

module.exports = salariesController;