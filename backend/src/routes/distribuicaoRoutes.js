const express = require('express');
const router = express.Router();
const distribuicaoController = require('../controllers/distribuicaoController');

router.post('/', distribuicaoController.registrarSaida);
router.get('/', distribuicaoController.listarDistribuicoes);

module.exports = router;