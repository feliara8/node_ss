const User = require('./models/user');
const Salary = require('./models/salary');
var salariesJson = require('./salaries_seed.json');


module.exports = async function seed() {
  const userParams = {
    username: 'test',
    password: 'password'
  };
  const user = new User(userParams);
  await user.save();
  console.log('seed user created');

  await Promise.all(salariesJson.map(async (salaryParams) => {
    const salary = new Salary(salaryParams);
    await salary.save();
  }));
  console.log('all seed salaries created');
};
