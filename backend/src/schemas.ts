// backend/src/schemas.ts

import { z } from 'zod';

export const GetMessagesSchema = z.object({
  after: z.string().datetime().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const MessageSchema = z.object({
  message: z.string().min(1),
  author: z.string().min(1),
});
