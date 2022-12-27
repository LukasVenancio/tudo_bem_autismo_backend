'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerResponsavel');

router.post('/', controller.post);
router.put('/:id', controller.put);
router.put('/senha/:id', controller.putPassword);
router.delete('/:id', controller.delete);
router.get('/', controller.get);
router.get('/:id', controller.getById);
router.post('/login', controller.login);

module.exports = router;