const express = require('express');
const passport = require('passport');

const postModel = require('../models/Post');

const router = express.Router();
const postApiPrefix = '/post';

router.get(`${postApiPrefix}/`, async (req, res, next) => {
  const posts = await postModel.find().where('delete_yn').equals('N');
  res.status(200).json({ posts });
});

router.get(`${postApiPrefix}/:seq`, async (req, res, next) => {
  const { seq } = req.params;
  const post = await postModel.findOne({ seq }).where('delete_yn').equals('N');

  if (!post) {
    return res.status(404).json({ message: '해당 게시물이 존재하지 않습니다.' });
  }

  res.status(200).json({ post });
});

router.post(`${postApiPrefix}/`, passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const { email } = req.user;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: '게시물 등록에 필요한 항목을 확인해주세요.' });
  }

  await new postModel({
    ...req.body,
    creator: email,
    updater: email,
  }).save();

  res.status(200).json({ message: '정상적으로 등록되었습니다.' });
});

router.patch(`${postApiPrefix}/:seq`, passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const { email } = req.user;
  const { seq } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: '게시물 수정에 필요한 항목을 확인해주세요.' });
  }

  const post = await postModel.findOne({ seq }).where('delete_yn').equals('N');

  if (!post) {
    return res.status(404).json({ message: '해당 게시물이 존재하지 않습니다.' });
  }

  if (email !== post.creator) {
    return res.status(401).json({ message: '해당 게시물에 대한 권한이 없습니다.' });
  }

  await postModel.updateOne(
    { seq },
    {
      ...req.body,
      updater: email,
    }
  );

  res.status(200).json({ message: '정상적으로 수정되었습니다.' });
});

router.delete(`${postApiPrefix}/:seq`, passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const { email } = req.user;
  const { seq } = req.params;

  const post = await postModel.findOne({ seq });

  if (!post) {
    return res.status(404).json({ message: '해당 게시물이 존재하지 않습니다.' });
  }

  if (email !== post.creator) {
    return res.status(401).json({ message: '해당 게시물에 대한 권한이 없습니다.' });
  }

  await postModel.updateOne(
    { seq },
    {
      delete_yn: 'Y',
      updater: email,
    }
  );

  res.status(200).json({ message: '정상적으로 삭제되었습니다.' });
});

module.exports = router;
