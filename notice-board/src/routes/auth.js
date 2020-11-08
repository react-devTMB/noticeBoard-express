import express from 'express';
import UserService from '../services/user.js';
import passport from '../config/passport.js';
import logger from '../config/logger.js';

const router = express.Router();
const userService = new UserService();

// signUp
router.post('/register', async (req, res) => {
  const { email } = req.body;
  const user = await userService.findUser(email);

  if (!user) {
    await userService.createUser(req.body);
    res.status(200).json({ success: true });
  } else {
    res.status(309).json({ success: false, message: '이미 등록된 email 입니다.' });
  }
});

// login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (info) return res.status(500).json({ ...info, success: false });

    return res.status(200).json({ success: true });
  })(req, res, next);
});

export default router;
