'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerNivelAutismo');

// router.post('/', controller.post);
// router.put('/:id', controller.put);
// router.delete('/:id', controller.delete);
router.get('/', controller.get);
router.get('/:id', controller.getById);

module.exports = router;