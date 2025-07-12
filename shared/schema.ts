import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';

// Sales Pipeline Data Model
export const SalesStageEnum = z.enum(['prospect', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost']);

export interface Deal {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  value: number;
  stage: z.infer<typeof SalesStageEnum>;
  probability: number; // 0-100
  expectedCloseDate: string;
  assignedTo: string; // HR Manager name
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueProjection {
  id: string;
  month: string; // YYYY-MM format
  projectedRevenue: number;
  actualRevenue: number;
  confidence: number; // 0-100
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string; // CREATE, UPDATE, DELETE
  entityType: string; // Deal, RevenueProjection
  entityId: string;
  userId: string; // HR Manager ID
  userName: string;
  oldData?: string; // JSON string of previous state
  newData?: string; // JSON string of new state
  timestamp: string;
  ipAddress?: string;
}

// Zod schemas for validation
export const dealInsertSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Valid email required'),
  value: z.number().min(0, 'Value must be positive'),
  stage: SalesStageEnum,
  probability: z.number().min(0).max(100, 'Probability must be 0-100'),
  expectedCloseDate: z.string().min(1, 'Expected close date is required'),
  assignedTo: z.string().min(1, 'Assigned person is required'),
  notes: z.string().default(''),
});

export const revenueProjectionInsertSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'),
  projectedRevenue: z.number().min(0, 'Projected revenue must be positive'),
  actualRevenue: z.number().min(0, 'Actual revenue must be positive'),
  confidence: z.number().min(0).max(100, 'Confidence must be 0-100'),
});

export const auditLogInsertSchema = z.object({
  action: z.enum(['CREATE', 'UPDATE', 'DELETE']),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  userId: z.string().min(1),
  userName: z.string().min(1),
  oldData: z.string().optional(),
  newData: z.string().optional(),
  ipAddress: z.string().optional(),
});

// Types for TypeScript
export type DealInsert = z.infer<typeof dealInsertSchema>;
export type RevenueProjectionInsert = z.infer<typeof revenueProjectionInsertSchema>;
export type AuditLogInsert = z.infer<typeof auditLogInsertSchema>;