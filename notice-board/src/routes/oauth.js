import express from 'express';
import passport from '../config/passport.js';
import logger from '../config/logger.js';

const router = express.Router();

// facebook login
router.get(
  '/facebook',
  passport.authenticate('facebook', {
    authType: 'rerequest',
    scope: ['public_profile', 'email'],
  })
);

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: 'http://localhost:3001/login' }), function (req, res) {
  res.redirect('http://localhost:3001/home');
});

export default router;
