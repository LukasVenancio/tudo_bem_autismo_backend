'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerBotaoApoio');

const multer = require("multer");

const Multer = multer({
    storage: multer.memoryStorage(),
    limits: 5 * 1024 * 1024,
});

router.post('/',Multer.any(), controller.post);
// router.put('/:id', controller.put);
router.delete('/:id', controller.delete);
// router.get('/', controller.get);
router.get('/:id', controller.get);

module.exports = router;