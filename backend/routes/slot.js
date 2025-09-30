const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const symbolController = require('../controllers/symbolController');
const isAuthenticated = require('../middlewares/isAuthenticated');


// Rutas de juego (modo demo permite acceso sin autenticación)
router.post('/spin', slotController.spin);
router.get('/history', isAuthenticated, slotController.history); // Solo historial requiere auth
router.get('/balance', slotController.balance);
// Listar símbolos y pagos (pública)
router.get('/symbols', symbolController.listSymbols);

module.exports = router;
