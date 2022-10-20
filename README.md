# Node summary statistics

## RUN Tests

- npm install
- npm run test

## Run DEV env locally

- docker-compose up

Notes:

A user is created in a seed step after spinning the server, also 9 salaries are added.

username: 'test'
password: 'password'

# How to authenticate

- Postman against localhost:1919/auth with body:

{
  "username": "test",
  "password": "password"
}

The response will contain an Authorization Header with the jwt response.
All protected endpoints calls should contain the Header Authorization with the token.

# Protected Endpoints

- GET /salaries    (get all salaries)
- GET /salaries   (get a salary, check salaries.test.js for params)
- POST /salaries   (create a salary, check salaries.test.js for params)
- DELETE /salaries/:id   (delete a salary, check salaries.test.js for params)
- PUT /salaries/:id   (update a salary, check salaries.test.js for params)

- GET /summary_statistics (get summary statistics, check summary_statistics.test.js for params)
- GET /summary_statistics/by_department (get summary statistics by department, check summary_statistics.test.js for params)
- GET /summary_statistics/by_department_and_sub_department (get summary statistics by department and subdepartment, check summary_statistics.test.js for params)
