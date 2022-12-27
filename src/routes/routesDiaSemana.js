'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerDiaSemana');

router.get('/', controller.get);

module.exports = router;