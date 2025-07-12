import express from 'express';
import { dealInsertSchema, revenueProjectionInsertSchema, auditLogInsertSchema } from '../shared/schema.js';
import { storage } from './storage.js';

const router = express.Router();

// Helper function to create audit logs
async function createAuditLog(action: string, entityType: string, entityId: string, oldData?: any, newData?: any) {
  try {
    await storage.createAuditLog({
      action,
      entityType,
      entityId,
      userId: 'hr-manager-1', // In a real app, this would come from authentication
      userName: 'HR Manager',
      oldData: oldData ? JSON.stringify(oldData) : undefined,
      newData: newData ? JSON.stringify(newData) : undefined,
      ipAddress: '127.0.0.1', // In a real app, this would come from the request
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

// Deal routes
router.get('/api/deals', async (req, res) => {
  try {
    const deals = await storage.getAllDeals();
    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

router.get('/api/deals/:id', async (req, res) => {
  try {
    const deal = await storage.getDealById(req.params.id);
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    res.json(deal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deal' });
  }
});

router.post('/api/deals', async (req, res) => {
  try {
    const validatedData = dealInsertSchema.parse(req.body);
    const deal = await storage.createDeal(validatedData);
    
    // Create audit log
    await createAuditLog('CREATE', 'Deal', deal.id, undefined, deal);
    
    res.status(201).json(deal);
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to create deal' });
  }
});

router.patch('/api/deals/:id', async (req, res) => {
  try {
    const oldDeal = await storage.getDealById(req.params.id);
    if (!oldDeal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    const validatedData = dealInsertSchema.partial().parse(req.body);
    const updatedDeal = await storage.updateDeal(req.params.id, validatedData);
    
    if (!updatedDeal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    // Create audit log
    await createAuditLog('UPDATE', 'Deal', req.params.id, oldDeal, updatedDeal);
    
    res.json(updatedDeal);
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to update deal' });
  }
});

router.delete('/api/deals/:id', async (req, res) => {
  try {
    const oldDeal = await storage.getDealById(req.params.id);
    if (!oldDeal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    const deleted = await storage.deleteDeal(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    // Create audit log
    await createAuditLog('DELETE', 'Deal', req.params.id, oldDeal, undefined);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});

router.get('/api/deals/stage/:stage', async (req, res) => {
  try {
    const deals = await storage.getDealsByStage(req.params.stage);
    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deals by stage' });
  }
});

// Revenue Projection routes
router.get('/api/revenue-projections', async (req, res) => {
  try {
    const projections = await storage.getAllRevenueProjections();
    res.json(projections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue projections' });
  }
});

router.get('/api/revenue-projections/:id', async (req, res) => {
  try {
    const projection = await storage.getRevenueProjectionById(req.params.id);
    if (!projection) {
      return res.status(404).json({ error: 'Revenue projection not found' });
    }
    res.json(projection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue projection' });
  }
});

router.post('/api/revenue-projections', async (req, res) => {
  try {
    const validatedData = revenueProjectionInsertSchema.parse(req.body);
    const projection = await storage.createRevenueProjection(validatedData);
    
    // Create audit log
    await createAuditLog('CREATE', 'RevenueProjection', projection.id, undefined, projection);
    
    res.status(201).json(projection);
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to create revenue projection' });
  }
});

router.patch('/api/revenue-projections/:id', async (req, res) => {
  try {
    const oldProjection = await storage.getRevenueProjectionById(req.params.id);
    if (!oldProjection) {
      return res.status(404).json({ error: 'Revenue projection not found' });
    }

    const validatedData = revenueProjectionInsertSchema.partial().parse(req.body);
    const updatedProjection = await storage.updateRevenueProjection(req.params.id, validatedData);
    
    if (!updatedProjection) {
      return res.status(404).json({ error: 'Revenue projection not found' });
    }

    // Create audit log
    await createAuditLog('UPDATE', 'RevenueProjection', req.params.id, oldProjection, updatedProjection);
    
    res.json(updatedProjection);
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to update revenue projection' });
  }
});

router.delete('/api/revenue-projections/:id', async (req, res) => {
  try {
    const oldProjection = await storage.getRevenueProjectionById(req.params.id);
    if (!oldProjection) {
      return res.status(404).json({ error: 'Revenue projection not found' });
    }

    const deleted = await storage.deleteRevenueProjection(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Revenue projection not found' });
    }

    // Create audit log
    await createAuditLog('DELETE', 'RevenueProjection', req.params.id, oldProjection, undefined);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete revenue projection' });
  }
});

// Audit Log routes
router.get('/api/audit-logs', async (req, res) => {
  try {
    const { entityType, entityId, userId, startDate, endDate } = req.query;
    
    let logs;
    if (entityType && entityId) {
      logs = await storage.getAuditLogsByEntity(entityType as string, entityId as string);
    } else if (userId) {
      logs = await storage.getAuditLogsByUser(userId as string);
    } else if (startDate && endDate) {
      logs = await storage.getAuditLogsByDateRange(startDate as string, endDate as string);
    } else {
      logs = await storage.getAllAuditLogs();
    }
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Analytics endpoints
router.get('/api/analytics/pipeline-summary', async (req, res) => {
  try {
    const deals = await storage.getAllDeals();
    
    const summary = {
      totalDeals: deals.length,
      totalValue: deals.reduce((sum, deal) => sum + deal.value, 0),
      averageDealSize: deals.length > 0 ? deals.reduce((sum, deal) => sum + deal.value, 0) / deals.length : 0,
      byStage: {} as Record<string, { count: number; value: number }>,
      weightedValue: deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0),
    };

    // Group by stage
    deals.forEach(deal => {
      if (!summary.byStage[deal.stage]) {
        summary.byStage[deal.stage] = { count: 0, value: 0 };
      }
      summary.byStage[deal.stage].count++;
      summary.byStage[deal.stage].value += deal.value;
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pipeline summary' });
  }
});

router.get('/api/analytics/revenue-forecast', async (req, res) => {
  try {
    const projections = await storage.getAllRevenueProjections();
    const deals = await storage.getAllDeals();
    
    // Calculate projected revenue from deals
    const dealsRevenue = deals
      .filter(deal => deal.stage !== 'closed-lost')
      .reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);

    // Get recent projections
    const recentProjections = projections
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12);

    res.json({
      projectedRevenueFromDeals: dealsRevenue,
      monthlyProjections: recentProjections,
      totalProjectedRevenue: recentProjections.reduce((sum, p) => sum + p.projectedRevenue, 0),
      totalActualRevenue: recentProjections.reduce((sum, p) => sum + p.actualRevenue, 0),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue forecast' });
  }
});

export default router;