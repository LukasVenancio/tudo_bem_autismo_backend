'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerTarefa');

router.post('/', controller.post);
router.post('/realizacao', controller.completeTask);
router.put('/', controller.put);
router.get('/crianca/:id', controller.get);
router.get('/:id', controller.getById);
router.post('/realizacao/listagem', controller.getCompletedTasks);
router.delete('/:id', controller.delete);

module.exports = router;