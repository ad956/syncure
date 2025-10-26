import { z } from 'zod';

// Message validation schemas
export const sendMessageSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
  message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
  messageType: z.enum(['text', 'image']).default('text'),
  imageUrl: z.string().url().optional(),
});

export const createRoomSchema = z.object({
  participantId: z.string().min(1, 'Doctor ID is required'),
});

export const getRoomsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export const getMessagesSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(50),
});

export const markAsReadSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type GetRoomsInput = z.infer<typeof getRoomsSchema>;
export type GetMessagesInput = z.infer<typeof getMessagesSchema>;
export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;