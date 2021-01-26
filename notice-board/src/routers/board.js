const express = require('express');

const boardModel = require('../models/Board');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const boards = await boardModel.find();
  res.status(200).json({ boards });
});

router.get('/:seq', async (req, res, next) => {
  const { seq } = req.params;

  const board = await boardModel.findOne({ seq });

  if (!board) {
    return res.status(404).json({ message: '해당 게시판이 존재하지 않습니다.' });
  }

  res.status(200).json({ board });
});

router.post('/', async (req, res, next) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ message: '게시판 카테고리를 확인해주세요.' });
  }

  const board = await boardModel.findOne({ category });

  if (board) {
    return res.status(409).json({ message: '이미 등록된 게시판 카테고리입니다.' });
  }

  await new boardModel(req.body).save();

  res.status(200).json({ message: '정상적으로 등록되었습니다.' });
});

module.exports = router;
