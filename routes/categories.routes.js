const express = require('express');
const router = express.Router();

const categoriesController = require('../controllers/categories.controller');
router.get('/get-categories', categoriesController.getAllCategories);
router.post('/add-category', categoriesController.addCategory);
router.post('/edit-category', categoriesController.editCategory);
router.post('/delete-category', categoriesController.deleteCategory);


module.exports = router;