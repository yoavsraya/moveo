const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/login', authController.POSTLogin);

router.post('/sign-up', authController.POSTSignUp);

router.get('/check-auth', authController.GETCheckAuth);

router.get('/admin-check', authController.GETCheckAdmin);

router.post('/logout', authController.POSTLogout);

module.exports = router;