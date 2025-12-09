const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');

router.get('/', categoriasController.getAllCategorias);
router.post('/', categoriasController.createCategoria);

module.exports = router;