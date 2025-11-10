const express = require('express')
const router = express.Router()
const doadoresController = require('../controllers/doadoresController.js')

router.get('/', doadoresController.getAllDoadores)

module.exports = router