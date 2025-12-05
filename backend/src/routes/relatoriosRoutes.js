const express = require('express');
const router = express.Router();
const relatoriosController = require('../controllers/relatoriosController');

router.get('/dashboard', relatoriosController.getResumoGeral);
router.get('/doacoes', relatoriosController.getRelatorioDoacoes);
router.get('/distribuicoes', relatoriosController.getRelatorioDistribuicoes);

module.exports = router;