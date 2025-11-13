const express = require('express')
const router = express.Router()

const doadoresController = require('../controllers/doadoresController.js')

router.get('/', doadoresController.getAllDoadores)
router.post('/', doadoresController.createDoador)
router.put('/:id', doadoresController.updateDoador)
router.delete('/:id', doadoresController.deleteDoador)

module.exports = router