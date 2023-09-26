const express = require('express');
const router = express.Router();

const tagsController = require('../controllers/tags.controller');
router.get('/get-tags/:categoryId', tagsController.getTagsForCategory);
router.post('/add-tag/:categoryId', tagsController.addTag);
router.post('/edit-tag/:categoryId', tagsController.editTag);
router.post('/delete-tag/:categoryId', tagsController.deleteTag);


module.exports = router;