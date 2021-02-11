const express = require('express');
const passport = require('passport');

const postModel = require('../models/Post');
const commentModel = require('../models/Comment');

const router = express.Router();
const postApiPrefix = '/post';
const commentApiPrefix = '/comment';

router.get(`${postApiPrefix}/:postSeq${commentApiPrefix}/`, async (req, res, next) => {
  console.log('get list');
});

router.get(`${postApiPrefix}/:postSeq${commentApiPrefix}/:seq`, async (req, res, next) => {
  console.log('get detail');
});

router.post(`${postApiPrefix}/:postSeq${commentApiPrefix}/`, passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const { postSeq: seq } = req.params;
  const { email } = req.user;
  const { content } = req.body;

  const post = await postModel.findOne({ seq });

  if (!post) {
    return res.status(404).json({ message: '해당 게시물이 존재하지 않습니다.' });
  }

  if (!content || !content.length) {
    return res.status(400).json({ message: '댓글을 입력해주세요.' });
  }

  const comment = await commentModel.create({ ...req.body, creator: email, updater: email });

  console.log('created comment >>> ', comment);

  post.comments.push(comment);
  await postModel.updateOne({ seq }, post);

  res.status(200).json({ message: '정상적으로 등록되었습니다.' });
});

router.patch(`${postApiPrefix}/:postSeq${commentApiPrefix}/:seq`, async (req, res, next) => {
  console.log('modify');
});

router.delete(`${postApiPrefix}/:postSeq${commentApiPrefix}/:seq`, async (req, res, next) => {
  console.log('remove');
});

module.exports = router;
