import express from 'express';
import { userLogin, userRegist, passportLogin } from '../services/user.js';

const router = express.Router();

// sign up
router.post('/signup', userRegist);

// login
router.post('/login', userLogin);
router.post('/passportLogin', passportLogin);

export default router;
