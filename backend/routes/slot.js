const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const symbolController = require('../controllers/symbolController');

// Realizar un giro
router.post('/spin', slotController.spin);

// Historial de jugadas
router.get('/history', slotController.history);

// Consultar saldo
router.get('/balance', slotController.balance);

// Listar símbolos y pagos
router.get('/symbols', symbolController.listSymbols);

module.exports = router;
