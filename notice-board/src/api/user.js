import express from 'express';
import { userLogin, userRegist } from '../services/user.js';

const router = express.Router();

// sign up
router.post('/signup', userRegist);

// login
router.post('/login', userLogin);

export default router;
