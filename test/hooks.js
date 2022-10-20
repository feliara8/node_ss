const sequelize = require('../database/database');
const seed = require('../seed');

// Global hooks
exports.mochaHooks = {
  async beforeAll() {
    // Ensure the tables and dummy user created
    await sequelize.sync({ force: true });
  },
  async beforeEach() {
    // Ensure all data in all tables is wiped out
    await sequelize.truncate({ cascade: true });
    
    await seed();
  }
};