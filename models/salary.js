const Sequelize = require('sequelize');
const sequelize = require('../database/database.js');

const Salaries = sequelize.define('salaries', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  salary: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  currency: {
    type: Sequelize.STRING,
    allowNull: false
  },
  department: {
    type: Sequelize.STRING,
    allowNull: false
  },
  sub_department: {
    type: Sequelize.STRING,
    allowNull: false
  },
  on_contract: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
});

module.exports = Salaries;