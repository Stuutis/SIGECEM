const express = require('express')
const router = express.Router();
const campanhasController = require('../controllers/campanhasController')

router.get('/', campanhasController.getAllCampanhas)
router.get('/:id', campanhasController.getCampanhaById)
router.post('/', campanhasController.createCampanha)
router.put('/:id', campanhasController.updateCampanha)
router.delete('/:id', campanhasController.deleteCamapnha)

module.exports = router;