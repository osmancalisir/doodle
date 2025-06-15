// backend/src/routes/rooms.ts

import { Router } from 'express';
import { createRoom, getRooms } from '../controllers/rooms.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

router.post('/', createRoom);
router.get('/', getRooms);

export { router as roomsRouter };
