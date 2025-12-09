const express = require('express');
const router = express.Router();
const financeiroController = require('../controllers/financeiroController');

router.post('/', financeiroController.registrarMovimentacao);
router.get('/', financeiroController.listarMovimentacoes);
router.get('/saldo', financeiroController.getSaldo);

module.exports = router;