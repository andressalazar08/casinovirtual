const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middlewares/isAuthenticated');

// Listar usuarios activos (solo admin)
router.get('/', isAdmin, userController.listUsers);

// Actualizar datos básicos del usuario (solo admin o el mismo usuario)
router.put('/:id', isAuthenticated, userController.updateUser);

// Desactivar lógicamente un usuario (solo admin)
router.delete('/:id', isAdmin, userController.deactivateUser);

// Recargar saldo del usuario (cualquier usuario autenticado)
router.post('/recharge', isAuthenticated, userController.rechargeBalance);

module.exports = router;
