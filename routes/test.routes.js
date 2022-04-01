const express = require('express');
const router = express.Router();

const testController = require('../controllers/test.controller');
router.get('/tests', testController.getAll);
router.post('/tests/save', testController.postTest);
router.post('/tests/delete', testController.deleteTest);



module.exports = router;