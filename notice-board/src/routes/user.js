import express from 'express';
import { userLogin, userRegist, passportLogin, userLogout } from '../services/user.js';

const router = express.Router();

// sign up
router.post('/signup', userRegist);

// login
router.post('/login', userLogin);
// logout
router.post('/logout', userLogout);
router.post('/passportLogin', passportLogin);

export default router;
