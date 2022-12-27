'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerGerenciamento');

router.post('/', controller.post);
router.get('/', controller.get);
router.get('/:id', controller.getById);
router.delete('/:id', controller.delete);

module.exports = router;