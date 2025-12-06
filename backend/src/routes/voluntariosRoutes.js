const express = require('express');
const router = express.Router();
const voluntariosController = require('../controllers/voluntariosController');

router.get('/', voluntariosController.getAllVoluntarios);
router.post('/', voluntariosController.createVoluntario);
router.put('/:id', voluntariosController.updateVoluntario);
router.delete('/:id', voluntariosController.deleteVoluntario);

module.exports = router