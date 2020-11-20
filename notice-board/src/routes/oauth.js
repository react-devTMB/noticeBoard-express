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

// kakao login
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', { failureRedirect: 'http://localhost:3001/login' }), function (req, res) {
  res.redirect('http://localhost:3001/home');
});

// github login
router.get('/github', passport.authenticate('github'));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: 'http://localhost:3001/login' }), function (req, res) {
  res.redirect('http://localhost:3001/home');
});

// naver login
router.get(
  '/naver',
  passport.authenticate('naver', {
    state : "123qwqwqw4"
  }), function (req, res) {
    console.log('req, res >> ' , req, res);
    // res.redirect('http://localhost:3000/home');
  }
);
// router.get('/naver', function(req, res) {
//   res.render(req);
// 	// res.render('index', { user: req.user });
// // });
// router.get('/naver', passport.authenticate('naver', function (req, res) {
//   console.log('res >> ' , res);
//   res.redirect('http://localhost:3000/home');
// });
// {
//   authType: 'rerequest',
//   scope: ['public_profile', 'email'],
// }
// router.get('/naver', passport.authenticate('naver', null), function(req, res) {
//   console.log('/auth/naver failed, stopped >> ' , req , res);
// });
// router.get('/naver', passport.authenticate('naver'));
// router.get('/naver', passport.authenticate('naver', {
//   authType: 'rerequest',
//   scope: ['public_profile', 'email'],
// }), function (req, res) {
//   console.log('req, res >> ' , req, res);
//   res.redirect('http://localhost:3000/home');
// });

router.get('/naver/callback', passport.authenticate('naver', { failureRedirect: 'http://localhost:3001/oauth/naver/callback' }), function (req, res) {
  console.log('req, res >> ' , req, res);
  // res.redirect('http://localhost:3000/home');
});


export default router;
