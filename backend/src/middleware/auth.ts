// backend/src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'Authorization token missing' });
    return;
  }

  if (token !== process.env.CHAT_TOKEN) {
    res.status(403).json({ error: 'Invalid token' });
    return;
  }

  next();
};
