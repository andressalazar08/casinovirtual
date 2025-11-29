const express = require('express');
const router = express.Router();
const modelConfigController = require('../controllers/modelConfigController');
const { isAuthenticated, isAdmin } = require('../middlewares/isAuthenticated');

// Obtener configuración del Modelo A (solo admin)
router.get('/modelo-a', isAdmin, modelConfigController.getModelAConfig);

// Guardar configuración del Modelo A (solo admin)
router.post('/modelo-a', isAdmin, modelConfigController.saveModelAConfig);

// Obtener configuración activa para el juego (autenticado)
router.get('/active', isAuthenticated, modelConfigController.getActiveGameConfig);

module.exports = router;
