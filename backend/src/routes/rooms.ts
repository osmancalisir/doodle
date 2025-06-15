// backend/src/routes/rooms.ts

import { Router } from 'express';
import { createRoom, getRooms, deleteRoom } from '../controllers/rooms.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

router.post('/', createRoom);
router.get('/', getRooms);
router.delete('/:roomId', deleteRoom);

export { router as roomsRouter };
