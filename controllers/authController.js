const _ = require('lodash');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

function whitelistedParams(params) {
  // accept only following parameters
  return _.pick(params, 'username', 'password');
}

async function safeExecute(req, _res, next, method) {
  try {
    await method({ bodyParams: whitelistedParams(req.body), query: whitelistedParams(req.query), params: req.params });
  }
  catch(error) {
    next(error);
  }
}

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'some_secret_key';

function returnError() {
  const err = new Error('Wrong user/password');
  err.code = 400;
  err.message = 'Wrong user/password';
  return err;
}

const authController = {
  authenticate: async (req, res, next) => {
    safeExecute(req, res, next, async ({ bodyParams }) => {
      const username =  bodyParams.username;
      const password = bodyParams.password;
      
      const user = await User.findOne({ where: { username: username } });

      if (user == null) {
        next(returnError());
      }

      // store md5 in real production environment instead, keeping basic for simplicity
      if(user.password == password) {
        let data = {
          username: username,
          userId: user.id,
        };
        const token = jwt.sign(data, JWT_SECRET_KEY);
        res.setHeader('Authorization', token);
        res.status(201);
        res.send();
      } else {
        next(returnError());
      }
    });
  },
};

module.exports = authController;