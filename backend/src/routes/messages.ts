// backend/src/routes/messages.ts

import { Router } from 'express';
import { getMessages, createMessage } from '../controllers/messages.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getMessages);
router.post('/', createMessage);

export { router as messagesRouter };
