const mongoHandler = require('../infrastructure/mongoHandler');
const express = require('express');
const router = express.Router();

router.get('/', async function(req, res, next) {
  const items = await mongoHandler.getAllFromCollection("data");
  res.send(items);
});

router.get('/:id', async function(req, res) {
  res.send(await mongoHandler.getDocumentFromCollectionById("data", req.params.id));
});

router.post('/', async function(req, res, next) {
  try {
    const response = await mongoHandler.putDocumentInCollection("data", req.body);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
