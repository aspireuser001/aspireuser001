import { Router, Request, Response } from 'express';
import { Models } from '../models/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const tenantRouter = Router();

tenantRouter.get('/', requireAuth, requireRole(['owner', 'admin']), async (req: Request, res: Response) => {
  const auth = (req as any).auth as { tenant_id: string };
  const tenant = await Models.Tenant.findByPk(auth.tenant_id);
  res.json({ tenant });
});

tenantRouter.patch('/', requireAuth, requireRole(['owner', 'admin']), async (req: Request, res: Response) => {
  const auth = (req as any).auth as { tenant_id: string };
  const { name, domain } = req.body as { name?: string; domain?: string };
  const tenant = await Models.Tenant.findByPk(auth.tenant_id);
  if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
  if (name !== undefined) tenant.name = name;
  if (domain !== undefined) tenant.domain = domain;
  await tenant.save();
  res.json({ tenant });
});

