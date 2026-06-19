import { z } from 'zod';

export const IdSchema = z.string().uuid();
export type Id = z.infer<typeof IdSchema>;

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const TimestampSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Timestamp = z.infer<typeof TimestampSchema>;
