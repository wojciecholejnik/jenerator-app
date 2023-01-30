const express = require('express');
const router = express.Router();

const questionsController = require('../controllers/questions.controller');
router.get('/get-questions-category/:categoryId', questionsController.getByCategory);
router.post('/add-question/:categoryId', questionsController.addQuestion);
router.delete('/delete-question/:questionId/:categoryId', questionsController.deleteQuestion);
router.post('/edit-question/:categoryId', questionsController.editQuestion);


// router.get('/questions', questionsController.getAll);
// router.get('/questions/:category/:type', questionsController.getBycategoryAndType);
// router.get('/questions/:category/:type/random', questionsController.getRandom);
// router.post('/randomQuestions', questionsController.getRandom);

// router.put('/questions/:id', questionsController.updateQuestion);
// router.post('/questions', questionsController.postQuestion);
// router.post('/save-file', questionsController.saveFile);
// router.post('/questionGenerate', questionsController.generateTestPdf);
// router.post('/questionGenerateResolved', questionsController.generateResolvedPdf);


module.exports = router;