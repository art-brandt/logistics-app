const express = require('express');
const requisitionsController = require('./requisitions.contoroller');

const requisitionsRouter = express.Router();

requisitionsRouter.use(
  express.json({ extended: true }),
  express.urlencoded({ extended: true })
);

requisitionsRouter.get('/', requisitionsController.get);
requisitionsRouter.get('/:id([0-9]+)', requisitionsController.getById);
requisitionsRouter.post('/', requisitionsController.create);
requisitionsRouter.put('/:id([0-9]+)', requisitionsController.update);
requisitionsRouter.delete('/:id([0-9]+)', requisitionsController.remove);

module.exports = requisitionsRouter;
