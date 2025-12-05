const express = require('express');
const router = express.Router();
const entradasController = require('../controllers/entradasController');

router.post('/', entradasController.registrarEntrada);
router.get('/', entradasController.listarEntradas);
router.get('/:id/itens', entradasController.getDetalhesEntrada);

module.exports = router;