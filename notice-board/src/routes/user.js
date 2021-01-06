import express from 'express';
import { userLogin, userRegist, passportLogin, userLogout, getMemberInfos } from '../services/user.js';

const router = express.Router();

// sign up
router.post('/signup', userRegist);

// login
router.post('/login', userLogin);
// logout
router.post('/logout', userLogout);
router.post('/passportLogin', passportLogin);
// userInfo
router.post('/memberInfos' , getMemberInfos);

export default router;
