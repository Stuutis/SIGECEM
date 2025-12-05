const express = require('express');
const router = express.Router();
const beneficiariosController = require('../controllers/beneficiariosController');

router.get('/', beneficiariosController.getAllBeneficiarios);
router.get('/:id', beneficiariosController.getBeneficiarioById);
router.post('/', beneficiariosController.createBeneficiario);
router.put('/:id', beneficiariosController.updateBeneficiario);
router.delete('/:id', beneficiariosController.deleteBeneficiario);

module.exports = router;