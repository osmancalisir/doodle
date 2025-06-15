// backend/src/index.ts

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { messagesRouter } from './routes/messages.js';
import { roomsRouter } from './routes/rooms.js';
import { healthRouter } from './routes/health.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
};
app.use(cors(corsOptions));

app.options('*', cors(corsOptions));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  if (req.method === 'POST') {
    const logBody = { ...req.body };
    
    if (req.path.includes('/messages') && typeof logBody.message === 'string') {
      if (logBody.message.length > 50) {
        logBody.message = logBody.message.slice(0, 50) + '...';
      }
    } else if (req.path.includes('/rooms')) {
      logBody.message = 'Room creation request';
    }
    
    console.log('Request Body:', JSON.stringify(logBody));
  }
  
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    message: 'Chat API is running',
    endpoints: {
      messages: '/api/v1/messages',
      rooms: '/api/v1/rooms',
      health: '/health'
    },
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/messages', messagesRouter);
app.use('/api/v1/rooms', roomsRouter);
app.use('/health', healthRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} does not exist`,
    suggestedEndpoints: [
      'GET /api/v1/rooms',
      'POST /api/v1/rooms',
      'GET /api/v1/messages/:roomId',
      'POST /api/v1/messages/:roomId',
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
  console.log(`🚪 Room endpoint: http://localhost:${PORT}/api/v1/rooms`);
  console.log(`🩺 Health endpoint: http://localhost:${PORT}/health`);
});
