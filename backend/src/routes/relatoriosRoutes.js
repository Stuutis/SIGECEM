const express = require("express");
const router = express.Router();
const relatoriosController = require("../controllers/relatoriosController");


router.get("/resumo-geral", relatoriosController.getResumoGeral);
router.get("/dashboard", relatoriosController.getDashboard);


router.get("/doacoes", relatoriosController.getRelatorioDoacoes);
router.get("/distribuicoes", relatoriosController.getRelatorioDistribuicoes);


router.get("/exportar/pdf", relatoriosController.exportPDF);
router.get("/exportar/excel", relatoriosController.exportExcel);

module.exports = router;
