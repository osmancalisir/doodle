// backend/src/controllers/messages.ts

import { query } from '../db.js';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { validateUUID } from '../utils/validation.js';

export const MessageSchema = z.object({
  message: z.string().min(1).max(2000),
  author: z.string().min(1).max(100),
});

export const GetMessagesSchema = z.object({
  after: z.string().datetime().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roomId = req.params.roomId;
    
    if (!roomId || !validateUUID(roomId)) {
      return res.status(400).json({ 
        error: 'Invalid room ID',
        message: 'Room ID must be a valid UUID format'
      });
    }

    const { after, limit = 50 } = GetMessagesSchema.parse(req.query);
    
    const roomExists = await query(
      'SELECT id FROM rooms WHERE id = $1',
      [roomId]
    );
    
    if (roomExists.rowCount === 0) {
      return res.status(404).json({
        error: 'Room not found',
        message: `No room found with ID: ${roomId}`
      });
    }

    const sql = `
      SELECT 
        id,
        message,
        author,
        created_at AS "createdAt"
      FROM messages
      WHERE room_id = $1
      ${after ? 'AND created_at < $2' : ''}
      ORDER BY created_at DESC
      LIMIT $${after ? 3 : 2}
    `;
    
    const params = after ? [roomId, after, limit] : [roomId, limit];
    const result = await query(sql, params);
    
    res.json(result.rows);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    next(error);
  }
};

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roomId = req.params.roomId;
    
    if (!roomId || !validateUUID(roomId)) {
      return res.status(400).json({ 
        error: 'Invalid room ID',
        message: 'Room ID must be a valid UUID format'
      });
    }

    const roomExists = await query(
      'SELECT id FROM rooms WHERE id = $1',
      [roomId]
    );
    
    if (roomExists.rowCount === 0) {
      return res.status(404).json({
        error: 'Room not found',
        message: `Cannot send message to non-existent room: ${roomId}`
      });
    }

    const { message, author } = MessageSchema.parse(req.body);
    
    const result = await query(
      `INSERT INTO messages (message, author, room_id)
       VALUES ($1, $2, $3)
       RETURNING id, message, author, created_at AS "createdAt"`,
      [message, author, roomId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    next(error);
  }
};
