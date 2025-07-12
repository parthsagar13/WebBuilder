import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';

// Sales Pipeline Data Model (keeping existing functionality)
export const SalesStageEnum = z.enum(['prospect', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost']);

// AI App Builder Enums
export const ProjectStatusEnum = z.enum(['generating', 'completed', 'failed', 'draft']);
export const UILibraryEnum = z.enum(['tailwind', 'bootstrap', 'material-ui', 'chakra-ui']);
export const GenerationTypeEnum = z.enum(['full-stack', 'frontend-only', 'backend-only']);

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
  entityType: string; // Deal, RevenueProjection, Project, Template
  entityId: string;
  userId: string; // User ID
  userName: string;
  oldData?: string; // JSON string of previous state
  newData?: string; // JSON string of new state
  timestamp: string;
  ipAddress?: string;
}

// AI App Builder Data Models
export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  generationsUsed: number;
  maxGenerations: number;
  githubToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  prompt: string; // Original user prompt
  status: z.infer<typeof ProjectStatusEnum>;
  uiLibrary: z.infer<typeof UILibraryEnum>;
  generationType: z.infer<typeof GenerationTypeEnum>;
  frontendCode?: string; // JSON string of React components
  backendCode?: string; // JSON string of Express routes and models
  previewUrl?: string;
  downloadUrl?: string;
  githubRepoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string; // blog, ecommerce, dashboard, etc.
  tags: string[];
  frontendTemplate: string; // JSON string of React components
  backendTemplate: string; // JSON string of Express routes and models
  popularity: number;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
}

export interface GenerationHistory {
  id: string;
  userId: string;
  projectId: string;
  prompt: string;
  aiProvider: string; // openai, codegeeX, etc.
  tokensUsed: number;
  success: boolean;
  errorMessage?: string;
  generationTime: number; // in milliseconds
  createdAt: string;
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

// AI App Builder Zod schemas for validation
export const userInsertSchema = z.object({
  email: z.string().email('Valid email required'),
  name: z.string().min(1, 'Name is required'),
  plan: z.enum(['free', 'pro', 'enterprise']).default('free'),
  generationsUsed: z.number().min(0).default(0),
  maxGenerations: z.number().min(1).default(5),
  githubToken: z.string().optional(),
});

export const projectInsertSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().default(''),
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  status: ProjectStatusEnum.default('draft'),
  uiLibrary: UILibraryEnum.default('tailwind'),
  generationType: GenerationTypeEnum.default('full-stack'),
  frontendCode: z.string().optional(),
  backendCode: z.string().optional(),
  previewUrl: z.string().optional(),
  downloadUrl: z.string().optional(),
  githubRepoUrl: z.string().optional(),
});

export const templateInsertSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).default([]),
  frontendTemplate: z.string().min(1, 'Frontend template is required'),
  backendTemplate: z.string().min(1, 'Backend template is required'),
  popularity: z.number().min(0).default(0),
  isPublic: z.boolean().default(true),
  createdBy: z.string().min(1, 'Creator ID is required'),
});

export const generationHistoryInsertSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  projectId: z.string().min(1, 'Project ID is required'),
  prompt: z.string().min(1, 'Prompt is required'),
  aiProvider: z.string().min(1, 'AI provider is required'),
  tokensUsed: z.number().min(0).default(0),
  success: z.boolean(),
  errorMessage: z.string().optional(),
  generationTime: z.number().min(0),
});

// Types for TypeScript
export type DealInsert = z.infer<typeof dealInsertSchema>;
export type RevenueProjectionInsert = z.infer<typeof revenueProjectionInsertSchema>;
export type AuditLogInsert = z.infer<typeof auditLogInsertSchema>;

// AI App Builder types
export type UserInsert = z.infer<typeof userInsertSchema>;
export type ProjectInsert = z.infer<typeof projectInsertSchema>;
export type TemplateInsert = z.infer<typeof templateInsertSchema>;
export type GenerationHistoryInsert = z.infer<typeof generationHistoryInsertSchema>;