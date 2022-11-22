const express = require('express');
const router = express.Router();

const questionsController = require('../controllers/questions.controller');
router.get('/questions', questionsController.getAll);
router.get('/questions/:category', questionsController.getByCategory);
router.get('/questions/:category/:type', questionsController.getBycategoryAndType);
router.get('/questions/:category/:type/random', questionsController.getRandom);
router.post('/randomQuestions', questionsController.getRandom);
router.delete('/questions/:id', questionsController.deleteQuestion);
router.put('/questions/:id', questionsController.updateQuestion);
router.post('/questions', questionsController.postQuestion);
router.post('/questionGenerate', questionsController.generateTestPdf);
router.post('/questionGenerateResolved', questionsController.generateResolvedPdf);


module.exports = router;