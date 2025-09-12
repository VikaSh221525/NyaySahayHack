import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { createChat, getChats, getMessages, deleteChat } from '../controllers/chat.controller.js';

const router = express.Router();

// POST /api/chat - Create new chat
router.post('/', protectRoute, createChat);

// GET /api/chat - Get all chats for user
router.get('/', protectRoute, getChats);

// GET /api/chat/messages/:id - Get messages for specific chat
router.get('/messages/:id', protectRoute, getMessages);

// DELETE /api/chat/:id - Delete specific chat
router.delete('/:id', protectRoute, deleteChat);

export default router;