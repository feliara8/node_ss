const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sequelize = require('./database/database');
const salaryRoutes = require('./routes/salaryRoutes');
const salaryStatisticRoutes = require('./routes/salaryStatisticRoutes');
const authRoutes = require('./routes/authRoutes');
const restrictMiddleware = require('./restrict');

const seed = require('./seed');

const PORT = 8080;

// Enable the json parser for all the routes
app.use(bodyParser.json());


app.get('/health_check', (_req, res) => {
  res.status(200).send('OK');
});

app.use('/auth', authRoutes);
//all salary routes will be restricted for authenticated users
app.use(restrictMiddleware);
app.use('/salaries', salaryRoutes);
app.use('/summary_statistics', salaryStatisticRoutes);

// 404 error handler (keep at bottom of stack)
app.use((req, res, _next) => {
  res.status(404).send('Not Found');
});

// Basic error handler
app.use((err, _req, res, _next) => {
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  const error = {
    code: err.code || 500,
    message: err.message || 'Unknown error'
  };
  res.status(error.code).send(error.message);
});

sequelize.sync().then(() => {
  console.log('Connection has been established successfully.');
  console.log('Running seed...');
  seed();

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});

module.exports = app;