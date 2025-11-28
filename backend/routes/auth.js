const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/isAuthenticated');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/check-session', authController.checkSession);
router.post('/change-password', isAuthenticated, authController.changePassword);

module.exports = router;
