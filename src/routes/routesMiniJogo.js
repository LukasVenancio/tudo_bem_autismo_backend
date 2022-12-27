'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerMiniJogo');

const multer = require('multer');
const { memoryStorage, } = require('multer');

const Multer = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

router.post('/', Multer.single('icone'), controller.post)
router.get('/listagem/:id', controller.get)
router.get('/listagem/crianca/:id', controller.getForChild)
router.get('/:id', controller.getById)

module.exports = router;