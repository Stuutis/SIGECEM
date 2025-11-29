const express = require('express')
const router = express.Router();
const familiasController = require('../controllers/familiasController');

router.get('/', familiasController.getAllFamilias)
router.get('/:id', familiasController.getFamiliaById)
router.post('/', familiasController.createFamilia)
router.put('/:id', familiasController.updateFamilia)
router.delete('/:id', familiasController.deleteFamilia)

module.exports = router;