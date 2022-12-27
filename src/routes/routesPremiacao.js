'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerPremiacao');

router.get('/:id', controller.get);

module.exports = router;