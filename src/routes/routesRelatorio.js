'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerRelatorio');

router.post('/', controller.post);
router.post('/listagem', controller.list);

module.exports = router;