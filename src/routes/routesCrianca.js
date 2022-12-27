'use strict';

const express = require('express');
const router = express.Router();
const firebase = require("../../services/firebase");
const controller = require('../controllers/controllerCrianca');

const multer = require("multer");
const Multer = multer({
    storage: multer.memoryStorage(),
    limits: 5 * 1024 * 1024,
});

router.post('/', Multer.single("arquivo"), firebase.uploadImage, controller.post);
router.get('/', controller.get);
router.get('/:id', controller.getById);
router.put('/:id', Multer.single("arquivo"), firebase.uploadImage, controller.put);
router.delete('/:id', controller.delete);

module.exports = router;