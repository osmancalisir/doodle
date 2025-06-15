// backend/src/index.ts

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { messagesRouter } from './routes/messages.js';
import { healthRouter } from './routes/health.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  if (process.env.NODE_ENV === 'development' && 
      req.method === 'POST' && 
      req.path.includes('/messages')) {
    console.log('Message body:', JSON.stringify({
      ...req.body,
      message: req.body.message?.slice(0, 50) + (req.body.message?.length > 50 ? '...' : '')
    }));
  }
  
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    message: 'Chat API is running',
    endpoints: {
      messages: '/api/v1/messages',
      health: '/health'
    },
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/messages', messagesRouter);
app.use('/health', healthRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} does not exist`,
    suggestedEndpoints: [
      'GET /api/v1/messages',
      'POST /api/v1/messages',
      'GET /health'
    ]
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Server Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Please try again later',
    ...(process.env.NODE_ENV === 'development' && { 
      details: {
        code: err.code,
        stack: err.stack
      }
    })
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Chat server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📝 Message endpoint: http://localhost:${PORT}/api/v1/messages`);
  console.log(`🩺 Health endpoint: http://localhost:${PORT}/health`);
});
