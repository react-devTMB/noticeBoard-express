const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const userModel = require('../models/User');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '이메일 또는 비밀번호를 확인해주세요.' });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: '이메일을 확인해주세요.' });
    }

    if (!user.comparePassword(password)) {
      return res.status(401).json({ message: '비밀번호를 확인해주세요.' });
    }

    const token = jwt.sign(
      { email: user.email, name: user.name },
      'Test123!', // FIXME
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(404).json({ message: '로그인에 실패했습니다.' });
  }
});

router.post('/signup', async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (user) {
    return res.status(422).json({ message: '이미 등록된 email 입니다.' });
  }

  await new userModel(req.body).save();

  res.status(200).json({ message: '정상적으로 등록되었습니다.' });
});

module.exports = router;
