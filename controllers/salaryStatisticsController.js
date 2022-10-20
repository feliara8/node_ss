const Salary = require('../models/salary');
const _ = require('lodash');
const sequelize = require('../database/database.js');

function whitelistedParams(params) {
  // accept only following parameters
  return _.pick(params, 'department', 'sub_department', 'on_contract');
}

async function safeExecute(req, _res, next, method) {
  try {
    await method({ bodyParams: whitelistedParams(req.body), query: whitelistedParams(req.query), params: req.params });
  }
  catch(error) {
    next(error);
  }
}

const salaryStatisticsController = {
  summaryStatistics: async (req, res, next) => {
    safeExecute(req, res, next, async ({ query }) => {
      if(query.on_contract === 'true' || query.on_contract === 'True') {
        query.on_contract = true;
      }
      const result = await Salary.findAll({
        attributes: [[sequelize.fn('max', sequelize.col('salary')), 'max'], [sequelize.fn('min', sequelize.col('salary')), 'min'], [sequelize.fn('AVG', sequelize.col('salary')), 'mean']],
        where: query
      });

      res.status(200);
      res.send(result);
    });
  },

  summaryStatisticsByDepartment: async (req, res, next) => {
    safeExecute(req, res, next, async ({ query }) => {
      if(query.on_contract === 'true' || query.on_contract === 'True') {
        query.on_contract = true;
      }
      const result = await Salary.findAll({
        attributes: ['department', [sequelize.fn('max', sequelize.col('salary')), 'max'], [sequelize.fn('min', sequelize.col('salary')), 'min'], [sequelize.fn('AVG', sequelize.col('salary')), 'mean']],
        where: query,
        group: 'department',
      });

      res.status(200);
      res.send(result);
    });
  },
  summaryStatisticsByDepartmentAndSubdepartment: async (req, res, next) => {
    safeExecute(req, res, next, async ({ query }) => {
      if(query.on_contract === 'true' || query.on_contract === 'True') {
        query.on_contract = true;
      }
      const result = await Salary.findAll({
        attributes: ['department', 'sub_department', [sequelize.fn('max', sequelize.col('salary')), 'max'], [sequelize.fn('min', sequelize.col('salary')), 'min'], [sequelize.fn('AVG', sequelize.col('salary')), 'mean']],
        
        where: query,
        group: ['department', 'sub_department'],
      });
      res.status(200);
      res.send(result);
    });
  }
};



module.exports = salaryStatisticsController;