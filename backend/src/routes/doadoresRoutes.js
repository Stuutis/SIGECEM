const express = require('express')
const router = express.Router()

const doadoresController = require('../controllers/doadoresController.js')

router.get('/', doadoresController.getAllDoadores)
router.post('/', doadoresController.createDoador)

module.exports = router