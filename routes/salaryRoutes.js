const express = require('express');
const router = express.Router();
const salariesController = require('../controllers/salariesController.js');

router.post('/', salariesController.addSalary);
router.get('/', salariesController.findSalaries);
router.get('/:id', salariesController.findSalaryById);
router.put('/:id', salariesController.updateSalary);
router.delete('/:id', salariesController.deleteSalaryById);

module.exports = router;