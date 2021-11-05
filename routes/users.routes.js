const express = require('express');
const router = express.Router();

const userControllert = require('../controllers/users.controller');
router.get('/users/:email/:password', userControllert.login);

module.exports = router;