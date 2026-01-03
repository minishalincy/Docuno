import express from 'express';
import { chatWithGemini } from '../controllers/chatController.js';

const chatRouter = express.Router();

chatRouter.post('/', chatWithGemini);

export default chatRouter;
