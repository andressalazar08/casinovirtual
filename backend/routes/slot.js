const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const symbolController = require('../controllers/symbolController');
const { isAuthenticated, hasRole } = require('../middlewares/isAuthenticated');


// Rutas de juego (requieren autenticación para jugar con saldo real)
router.post('/spin', isAuthenticated, slotController.spin);
router.get('/history', isAuthenticated, slotController.history);
router.get('/balance', isAuthenticated, slotController.balance);

// Listar símbolos y pagos (pública)
router.get('/symbols', symbolController.listSymbols);

module.exports = router;
