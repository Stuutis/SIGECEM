const express = require('express');
const router = express.Router();
const voluntariosController = require('../controllers/voluntariosController');

// 🚨 CORREÇÃO FINAL: Usando o nome da pasta no SINGULAR: 'middleware'
const authMiddleware = require('../middleware/authMiddleware.js'); 
const adminMiddleware = require('../middleware/adminMiddleware.js'); 

router.get('/', authMiddleware, adminMiddleware, voluntariosController.getAllVoluntarios);
router.post('/', authMiddleware, adminMiddleware, voluntariosController.createVoluntario);
router.put('/:id', authMiddleware, adminMiddleware, voluntariosController.updateVoluntario);
router.delete('/:id', authMiddleware, adminMiddleware, voluntariosController.deleteVoluntario);

module.exports = router;