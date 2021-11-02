const express = require('express');
const router = express.Router();

const userControllert = require('../controllers/users.controller');
router.get('/users', userControllert.getAll);
router.get('/users/:email', userControllert.getByEmail);

module.exports = router;