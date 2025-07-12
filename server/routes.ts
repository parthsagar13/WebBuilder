import express from 'express';
import { 
  dealInsertSchema, 
  revenueProjectionInsertSchema, 
  auditLogInsertSchema,
  userInsertSchema,
  projectInsertSchema,
  templateInsertSchema,
  generationHistoryInsertSchema
} from '../shared/schema';
import { storage } from './storage';

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

// AI App Builder Routes

// User routes
router.get('/api/users', async (req, res) => {
  try {
    const users = await storage.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/api/users/:id', async (req, res) => {
  try {
    const user = await storage.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/api/users', async (req, res) => {
  try {
    const validatedData = userInsertSchema.parse(req.body);
    const user = await storage.createUser(validatedData);
    
    // Create audit log
    await createAuditLog('CREATE', 'User', user.id, undefined, user);
    
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Project routes
router.get('/api/projects', async (req, res) => {
  try {
    const { userId, status } = req.query;
    
    let projects;
    if (userId) {
      projects = await storage.getProjectsByUserId(userId as string);
    } else if (status) {
      projects = await storage.getProjectsByStatus(status as string);
    } else {
      projects = await storage.getAllProjects();
    }
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await storage.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

router.post('/api/projects', async (req, res) => {
  try {
    const validatedData = projectInsertSchema.parse(req.body);
    const project = await storage.createProject(validatedData);
    
    // Create audit log
    await createAuditLog('CREATE', 'Project', project.id, undefined, project);
    
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.patch('/api/projects/:id', async (req, res) => {
  try {
    const oldProject = await storage.getProjectById(req.params.id);
    if (!oldProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const validatedData = projectInsertSchema.partial().parse(req.body);
    const updatedProject = await storage.updateProject(req.params.id, validatedData);
    
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create audit log
    await createAuditLog('UPDATE', 'Project', req.params.id, oldProject, updatedProject);
    
    res.json(updatedProject);
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Template routes
router.get('/api/templates', async (req, res) => {
  try {
    const { category, popular } = req.query;
    
    let templates;
    if (category) {
      templates = await storage.getTemplatesByCategory(category as string);
    } else if (popular) {
      templates = await storage.getPopularTemplates(parseInt(popular as string) || 10);
    } else {
      templates = await storage.getAllTemplates();
    }
    
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

router.get('/api/templates/:id', async (req, res) => {
  try {
    const template = await storage.getTemplateById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

router.post('/api/templates', async (req, res) => {
  try {
    const validatedData = templateInsertSchema.parse(req.body);
    const template = await storage.createTemplate(validatedData);
    
    // Create audit log
    await createAuditLog('CREATE', 'Template', template.id, undefined, template);
    
    res.status(201).json(template);
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// AI Generation endpoint (placeholder for now)
router.post('/api/generate', async (req, res) => {
  try {
    const { prompt, uiLibrary, generationType, userId } = req.body;
    
    // For now, return a placeholder response
    // In a real implementation, this would call OpenAI API
    const mockProject = {
      id: 'generated-' + Date.now(),
      prompt,
      uiLibrary: uiLibrary || 'tailwind',
      generationType: generationType || 'full-stack',
      status: 'completed',
      frontendCode: JSON.stringify({
        'App.tsx': `import React from 'react';
        
function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Generated App</h1>
      <p>This app was generated from: ${prompt}</p>
    </div>
  );
}

export default App;`,
        'package.json': JSON.stringify({
          name: 'generated-app',
          dependencies: {
            react: '^18.0.0',
            'react-dom': '^18.0.0'
          }
        })
      }),
      backendCode: JSON.stringify({
        'index.js': `const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Generated API for: ${prompt}' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`
      })
    };
    
    res.json(mockProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate project' });
  }
});

export default router;