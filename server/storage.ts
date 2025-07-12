import { Deal, RevenueProjection, AuditLog, DealInsert, RevenueProjectionInsert, AuditLogInsert } from '../shared/schema.js';

export interface IStorage {
  // Deal operations
  createDeal(deal: DealInsert): Promise<Deal>;
  getAllDeals(): Promise<Deal[]>;
  getDealById(id: string): Promise<Deal | null>;
  updateDeal(id: string, deal: Partial<DealInsert>): Promise<Deal | null>;
  deleteDeal(id: string): Promise<boolean>;
  getDealsByStage(stage: string): Promise<Deal[]>;

  // Revenue Projection operations
  createRevenueProjection(projection: RevenueProjectionInsert): Promise<RevenueProjection>;
  getAllRevenueProjections(): Promise<RevenueProjection[]>;
  getRevenueProjectionById(id: string): Promise<RevenueProjection | null>;
  updateRevenueProjection(id: string, projection: Partial<RevenueProjectionInsert>): Promise<RevenueProjection | null>;
  deleteRevenueProjection(id: string): Promise<boolean>;
  getRevenueProjectionsByDateRange(startMonth: string, endMonth: string): Promise<RevenueProjection[]>;

  // Audit Log operations
  createAuditLog(log: AuditLogInsert): Promise<AuditLog>;
  getAllAuditLogs(): Promise<AuditLog[]>;
  getAuditLogsByEntity(entityType: string, entityId: string): Promise<AuditLog[]>;
  getAuditLogsByUser(userId: string): Promise<AuditLog[]>;
  getAuditLogsByDateRange(startDate: string, endDate: string): Promise<AuditLog[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private deals: Deal[] = [];
  private revenueProjections: RevenueProjection[] = [];
  private auditLogs: AuditLog[] = [];

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
}

export const storage = new MemStorage();