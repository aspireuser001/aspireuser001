import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Models } from '../models/index.js';

export const quotationsRouter = Router();

quotationsRouter.use(requireAuth);

quotationsRouter.get('/', async (req: Request, res: Response) => {
  const { tenant_id } = (req as any).auth as { tenant_id: string };
  const quotations = await Models.Quotation.findAll({ where: { tenant_id }, order: [['created_at', 'DESC']], include: [{ model: Models.Customer, as: 'customer' }] });
  res.json({ quotations });
});

quotationsRouter.post('/', async (req: Request, res: Response) => {
  const { tenant_id } = (req as any).auth as { tenant_id: string };
  const { customer_id, number, issue_date, valid_until, currency, subtotal, tax_total, total, notes } = req.body;
  const created = await Models.Quotation.create({ tenant_id, customer_id, number, issue_date, valid_until, currency, subtotal, tax_total, total, notes });
  res.status(201).json({ quotation: created });
});

quotationsRouter.get('/:id', async (req: Request, res: Response) => {
  const { tenant_id } = (req as any).auth as { tenant_id: string };
  const quotation = await Models.Quotation.findOne({ where: { id: req.params.id, tenant_id }, include: [{ model: Models.Customer, as: 'customer' }] });
  if (!quotation) return res.status(404).json({ error: 'Not found' });
  res.json({ quotation });
});

quotationsRouter.patch('/:id', async (req: Request, res: Response) => {
  const { tenant_id } = (req as any).auth as { tenant_id: string };
  const quotation = await Models.Quotation.findOne({ where: { id: req.params.id, tenant_id } });
  if (!quotation) return res.status(404).json({ error: 'Not found' });
  Object.assign(quotation, req.body || {});
  await quotation.save();
  res.json({ quotation });
});

quotationsRouter.delete('/:id', async (req: Request, res: Response) => {
  const { tenant_id } = (req as any).auth as { tenant_id: string };
  const quotation = await Models.Quotation.findOne({ where: { id: req.params.id, tenant_id } });
  if (!quotation) return res.status(404).json({ error: 'Not found' });
  await quotation.destroy();
  res.status(204).send();
});

