const express = require('express');

const router = express.Router();

router.get('/', async (req, res, next) => {
  console.log('get list');
});

router.get('/:seq', async (req, res, next) => {
  console.log('get detail');
});

router.post('/', async (req, res, next) => {
  console.log('add');
});

router.patch('/:seq', async (req, res, next) => {
  console.log('modify');
});

router.delete('/:seq', async (req, res, next) => {
  console.log('remove');
});

module.exports = router;
