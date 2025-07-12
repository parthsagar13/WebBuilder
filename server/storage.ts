import { 
  Deal, 
  RevenueProjection, 
  AuditLog, 
  DealInsert, 
  RevenueProjectionInsert, 
  AuditLogInsert,
  User,
  UserInsert,
  Project,
  ProjectInsert,
  Template,
  TemplateInsert,
  GenerationHistory,
  GenerationHistoryInsert
} from '../shared/schema';

export interface IStorage {
  // Deal operations (keeping existing functionality)
  createDeal(deal: DealInsert): Promise<Deal>;
  getAllDeals(): Promise<Deal[]>;
  getDealById(id: string): Promise<Deal | null>;
  updateDeal(id: string, deal: Partial<DealInsert>): Promise<Deal | null>;
  deleteDeal(id: string): Promise<boolean>;
  getDealsByStage(stage: string): Promise<Deal[]>;

  // Revenue Projection operations (keeping existing functionality)
  createRevenueProjection(projection: RevenueProjectionInsert): Promise<RevenueProjection>;
  getAllRevenueProjections(): Promise<RevenueProjection[]>;
  getRevenueProjectionById(id: string): Promise<RevenueProjection | null>;
  updateRevenueProjection(id: string, projection: Partial<RevenueProjectionInsert>): Promise<RevenueProjection | null>;
  deleteRevenueProjection(id: string): Promise<boolean>;
  getRevenueProjectionsByDateRange(startMonth: string, endMonth: string): Promise<RevenueProjection[]>;

  // Audit Log operations (keeping existing functionality)
  createAuditLog(log: AuditLogInsert): Promise<AuditLog>;
  getAllAuditLogs(): Promise<AuditLog[]>;
  getAuditLogsByEntity(entityType: string, entityId: string): Promise<AuditLog[]>;
  getAuditLogsByUser(userId: string): Promise<AuditLog[]>;
  getAuditLogsByDateRange(startDate: string, endDate: string): Promise<AuditLog[]>;

  // User operations (AI App Builder)
  createUser(user: UserInsert): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(id: string, user: Partial<UserInsert>): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;

  // Project operations (AI App Builder)
  createProject(project: ProjectInsert): Promise<Project>;
  getAllProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | null>;
  getProjectsByUserId(userId: string): Promise<Project[]>;
  updateProject(id: string, project: Partial<ProjectInsert>): Promise<Project | null>;
  deleteProject(id: string): Promise<boolean>;
  getProjectsByStatus(status: string): Promise<Project[]>;

  // Template operations (AI App Builder)
  createTemplate(template: TemplateInsert): Promise<Template>;
  getAllTemplates(): Promise<Template[]>;
  getTemplateById(id: string): Promise<Template | null>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
  getPopularTemplates(limit: number): Promise<Template[]>;
  updateTemplate(id: string, template: Partial<TemplateInsert>): Promise<Template | null>;
  deleteTemplate(id: string): Promise<boolean>;

  // Generation History operations (AI App Builder)
  createGenerationHistory(history: GenerationHistoryInsert): Promise<GenerationHistory>;
  getAllGenerationHistory(): Promise<GenerationHistory[]>;
  getGenerationHistoryById(id: string): Promise<GenerationHistory | null>;
  getGenerationHistoryByUserId(userId: string): Promise<GenerationHistory[]>;
  getGenerationHistoryByProjectId(projectId: string): Promise<GenerationHistory[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private deals: Deal[] = [];
  private revenueProjections: RevenueProjection[] = [];
  private auditLogs: AuditLog[] = [];
  // AI App Builder data stores
  private users: User[] = [];
  private projects: Project[] = [];
  private templates: Template[] = [];
  private generationHistory: GenerationHistory[] = [];

  // Helper method to generate IDs
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Deal operations
  async createDeal(dealData: DealInsert): Promise<Deal> {
    const deal: Deal = {
      id: this.generateId(),
      ...dealData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.deals.push(deal);
    return deal;
  }

  async getAllDeals(): Promise<Deal[]> {
    return [...this.deals];
  }

  async getDealById(id: string): Promise<Deal | null> {
    return this.deals.find(deal => deal.id === id) || null;
  }

  async updateDeal(id: string, dealData: Partial<DealInsert>): Promise<Deal | null> {
    const dealIndex = this.deals.findIndex(deal => deal.id === id);
    if (dealIndex === -1) return null;

    this.deals[dealIndex] = {
      ...this.deals[dealIndex],
      ...dealData,
      updatedAt: new Date().toISOString(),
    };
    return this.deals[dealIndex];
  }

  async deleteDeal(id: string): Promise<boolean> {
    const dealIndex = this.deals.findIndex(deal => deal.id === id);
    if (dealIndex === -1) return false;

    this.deals.splice(dealIndex, 1);
    return true;
  }

  async getDealsByStage(stage: string): Promise<Deal[]> {
    return this.deals.filter(deal => deal.stage === stage);
  }

  // Revenue Projection operations
  async createRevenueProjection(projectionData: RevenueProjectionInsert): Promise<RevenueProjection> {
    const projection: RevenueProjection = {
      id: this.generateId(),
      ...projectionData,
      createdAt: new Date().toISOString(),
    };
    this.revenueProjections.push(projection);
    return projection;
  }

  async getAllRevenueProjections(): Promise<RevenueProjection[]> {
    return [...this.revenueProjections];
  }

  async getRevenueProjectionById(id: string): Promise<RevenueProjection | null> {
    return this.revenueProjections.find(projection => projection.id === id) || null;
  }

  async updateRevenueProjection(id: string, projectionData: Partial<RevenueProjectionInsert>): Promise<RevenueProjection | null> {
    const projectionIndex = this.revenueProjections.findIndex(projection => projection.id === id);
    if (projectionIndex === -1) return null;

    this.revenueProjections[projectionIndex] = {
      ...this.revenueProjections[projectionIndex],
      ...projectionData,
    };
    return this.revenueProjections[projectionIndex];
  }

  async deleteRevenueProjection(id: string): Promise<boolean> {
    const projectionIndex = this.revenueProjections.findIndex(projection => projection.id === id);
    if (projectionIndex === -1) return false;

    this.revenueProjections.splice(projectionIndex, 1);
    return true;
  }

  async getRevenueProjectionsByDateRange(startMonth: string, endMonth: string): Promise<RevenueProjection[]> {
    return this.revenueProjections.filter(projection => 
      projection.month >= startMonth && projection.month <= endMonth
    );
  }

  // Audit Log operations
  async createAuditLog(logData: AuditLogInsert): Promise<AuditLog> {
    const log: AuditLog = {
      id: this.generateId(),
      ...logData,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.push(log);
    return log;
  }

  async getAllAuditLogs(): Promise<AuditLog[]> {
    return [...this.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async getAuditLogsByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    return this.auditLogs
      .filter(log => log.entityType === entityType && log.entityId === entityId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async getAuditLogsByUser(userId: string): Promise<AuditLog[]> {
    return this.auditLogs
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async getAuditLogsByDateRange(startDate: string, endDate: string): Promise<AuditLog[]> {
    return this.auditLogs
      .filter(log => log.timestamp >= startDate && log.timestamp <= endDate)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // User operations (AI App Builder)
  async createUser(userData: UserInsert): Promise<User> {
    const user: User = {
      id: this.generateId(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async updateUser(id: string, userData: Partial<UserInsert>): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    return this.users[userIndex];
  }

  async deleteUser(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }

  // Project operations (AI App Builder)
  async createProject(projectData: ProjectInsert): Promise<Project> {
    const project: Project = {
      id: this.generateId(),
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.push(project);
    return project;
  }

  async getAllProjects(): Promise<Project[]> {
    return [...this.projects];
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.projects.find(project => project.id === id) || null;
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    return this.projects.filter(project => project.userId === userId);
  }

  async updateProject(id: string, projectData: Partial<ProjectInsert>): Promise<Project | null> {
    const projectIndex = this.projects.findIndex(project => project.id === id);
    if (projectIndex === -1) return null;

    this.projects[projectIndex] = {
      ...this.projects[projectIndex],
      ...projectData,
      updatedAt: new Date().toISOString(),
    };
    return this.projects[projectIndex];
  }

  async deleteProject(id: string): Promise<boolean> {
    const projectIndex = this.projects.findIndex(project => project.id === id);
    if (projectIndex === -1) return false;

    this.projects.splice(projectIndex, 1);
    return true;
  }

  async getProjectsByStatus(status: string): Promise<Project[]> {
    return this.projects.filter(project => project.status === status);
  }

  // Template operations (AI App Builder)
  async createTemplate(templateData: TemplateInsert): Promise<Template> {
    const template: Template = {
      id: this.generateId(),
      ...templateData,
      createdAt: new Date().toISOString(),
    };
    this.templates.push(template);
    return template;
  }

  async getAllTemplates(): Promise<Template[]> {
    return [...this.templates];
  }

  async getTemplateById(id: string): Promise<Template | null> {
    return this.templates.find(template => template.id === id) || null;
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return this.templates.filter(template => template.category === category);
  }

  async getPopularTemplates(limit: number): Promise<Template[]> {
    return this.templates
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  }

  async updateTemplate(id: string, templateData: Partial<TemplateInsert>): Promise<Template | null> {
    const templateIndex = this.templates.findIndex(template => template.id === id);
    if (templateIndex === -1) return null;

    this.templates[templateIndex] = {
      ...this.templates[templateIndex],
      ...templateData,
    };
    return this.templates[templateIndex];
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const templateIndex = this.templates.findIndex(template => template.id === id);
    if (templateIndex === -1) return false;

    this.templates.splice(templateIndex, 1);
    return true;
  }

  // Generation History operations (AI App Builder)
  async createGenerationHistory(historyData: GenerationHistoryInsert): Promise<GenerationHistory> {
    const history: GenerationHistory = {
      id: this.generateId(),
      ...historyData,
      createdAt: new Date().toISOString(),
    };
    this.generationHistory.push(history);
    return history;
  }

  async getAllGenerationHistory(): Promise<GenerationHistory[]> {
    return [...this.generationHistory];
  }

  async getGenerationHistoryById(id: string): Promise<GenerationHistory | null> {
    return this.generationHistory.find(history => history.id === id) || null;
  }

  async getGenerationHistoryByUserId(userId: string): Promise<GenerationHistory[]> {
    return this.generationHistory.filter(history => history.userId === userId);
  }

  async getGenerationHistoryByProjectId(projectId: string): Promise<GenerationHistory[]> {
    return this.generationHistory.filter(history => history.projectId === projectId);
  }
}

export const storage = new MemStorage();