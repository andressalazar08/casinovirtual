const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');

// Realizar un giro
router.post('/spin', slotController.spin);

// Historial de jugadas
router.get('/history', slotController.history);

// Consultar saldo
router.get('/balance', slotController.balance);

module.exports = router;
