const express = require('express');
const passport = require('../config/passport');

import express from 'express';
import passport from '../middlewares/passport.js';
// import logger from '../config/logger.js';

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

// google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:3001/login' }), (req, res) => {
  res.redirect('http://localhost:3001/home');
});

export default router;
