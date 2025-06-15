// backend/src/routes/messages.ts

import { Router } from 'express';
import { getMessages, createMessage } from '../controllers/messages.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/:roomId([a-f0-9-]+)', getMessages);
router.post('/:roomId([a-f0-9-]+)', createMessage);

export { router as messagesRouter };
