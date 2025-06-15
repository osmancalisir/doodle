// backend/src/controllers/messages.ts

import { Request, Response, NextFunction } from 'express';
import { query } from '../db.js';
import { z } from 'zod';

export const MessageSchema = z.object({
  message: z.string().min(1),
  author: z.string().min(1),
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
    const { after, limit = 50 } = GetMessagesSchema.parse(req.query);
    
    const sql = `
      SELECT 
        id,
        message,
        author,
        created_at AS "createdAt"
      FROM messages
      ${after ? 'WHERE created_at < $1' : ''}
      ORDER BY created_at DESC
      LIMIT $${after ? 2 : 1}
    `;
    
    const params = after ? [after, limit] : [limit];
    const result = await query(sql, params);
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message, author } = MessageSchema.parse(req.body);
    
    const result = await query(
      `INSERT INTO messages (message, author)
       VALUES ($1, $2)
       RETURNING id, message, author, created_at AS "createdAt"`,
      [message, author]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
