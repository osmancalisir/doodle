// backend/src/controllers/rooms.ts

import { query } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { validateUUID } from '../utils/validation.js';

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Invalid room name' });
    }
    
    const roomId = uuidv4();
    
    const result = await query(
      `INSERT INTO rooms (id, name) VALUES ($1, $2) RETURNING *`,
      [roomId, name]
    );
    
    res.status(201).json({ roomId });
  } catch (error) {
    console.error('Room creation error:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

export const getRooms = async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT id, name, created_at AS "createdAt" FROM rooms ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
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
        message: `No room found with ID: ${roomId}`
      });
    }

    await query('DELETE FROM rooms WHERE id = $1', [roomId]);
    
    res.status(204).send();
  } catch (error) {
    console.error('Room deletion error:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
};
