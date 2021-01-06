import express from 'express';
import { postRegist } from '../services/board.js';

const router = express.Router();

// sign up
router.post('/post', postRegist);

// login

export default router;
