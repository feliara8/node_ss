const express = require('express');
const router = express.Router();
const salaryStatisticsController = require('../controllers/salaryStatisticsController.js');

router.get('/', salaryStatisticsController.summaryStatistics);
router.get('/by_department', salaryStatisticsController.summaryStatisticsByDepartment);
router.get('/by_department_and_sub_department', salaryStatisticsController.summaryStatisticsByDepartmentAndSubdepartment);

module.exports = router;