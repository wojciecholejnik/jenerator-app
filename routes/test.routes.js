const express = require('express');
const router = express.Router();
const testController = require('../controllers/test.controller');

router.get('/get-tests', testController.getAll);
router.post('/add-test', testController.addTest);
router.delete('/delete-test/:id', testController.deleteTest);



module.exports = router;