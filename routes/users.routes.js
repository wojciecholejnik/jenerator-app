const express = require('express');
const router = express.Router();

const userControllert = require('../controllers/users.controller');
router.get('/users/:email/:password', userControllert.login);
router.put('/users/changePassword', userControllert.changePassword);
router.put('/users/changeName', userControllert.changeName);
router.put('/users/changeLogin', userControllert.changeLogin);
router.put('/users/changeEmoticon', userControllert.changeEmoticon);

module.exports = router;