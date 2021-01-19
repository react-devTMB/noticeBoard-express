import express from 'express';

import passport from '../middlewares/passport.js';
import UserModel from '../models/User.js';

const router = express.Router();

router.post('/login', async (req, res, next) => {});

router.post('/register', async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (user) {
    return res.status(422).json({ message: '이미 등록된 email 입니다.' });
  }

  await new UserModel(req.body).save();

  res.status(200).json({ message: '정상적으로 등록되었습니다.' });
});

export default router;
