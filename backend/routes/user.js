const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Listar usuarios activos
router.get('/', userController.listUsers);

// Actualizar datos básicos del usuario
router.put('/:id', userController.updateUser);

// Desactivar lógicamente un usuario
router.delete('/:id', userController.deactivateUser);

module.exports = router;
