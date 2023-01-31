const express = require('express');
const router = express.Router();

const userControllert = require('../controllers/users.controller');
router.post('/users/login', userControllert.login);
router.get('/user/:id', userControllert.getUserData);

router.put('/users/changePassword', userControllert.changePassword);
router.put('/users/changeName', userControllert.changeName);
router.put('/users/changeLogin', userControllert.changeLogin);
router.put('/users/changeEmoticon', userControllert.changeEmoticon);
router.put('/users/changeBackground', userControllert.changeBackground);
module.exports = router;