import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Models } from '../models/index.js';

export const invoicesRouter = Router();

invoicesRouter.use(requireAuth);

invoicesRouter.get('/', async (req: Request, res: Response) => {
  const { tenant_id } = (req as any).auth as { tenant_id: string };
  const invoices = await Models.Invoice.findAll({ where: { tenant_id }, order: [['created_at', 'DESC']], include: [{ model: Models.Customer, as: 'customer' }, { model: Models.Quotation, as: 'quotation' }] });
  res.json({ invoices });
});

invoicesRouter.post('/', async (req: Request, res: Response) => {
  const { tenant_id } = (req as any).auth as { tenant_id: string };
  const { customer_id, quotation_id, number, issue_date, due_date, currency, subtotal, tax_total, total, notes } = req.body;
  const created = await Models.Invoice.create({ tenant_id, customer_id, quotation_id, number, issue_date, due_date, currency, subtotal, tax_total, total, notes });
  res.status(201).json({ invoice: created });
});

invoicesRouter.get('/:id', async (req: Request, res: Response) => {
  const { tenant_id } = (req as any).auth as { tenant_id: string };
  const invoice = await Models.Invoice.findOne({ where: { id: req.params.id, tenant_id }, include: [{ model: Models.Customer, as: 'customer' }, { model: Models.Quotation, as: 'quotation' }] });
  if (!invoice) return res.status(404).json({ error: 'Not found' });
  res.json({ invoice });
});

invoicesRouter.patch('/:id', async (req: Request, res: Response) => {
  const { tenant_id } = (req as any).auth as { tenant_id: string };
  const invoice = await Models.Invoice.findOne({ where: { id: req.params.id, tenant_id } });
  if (!invoice) return res.status(404).json({ error: 'Not found' });
  Object.assign(invoice, req.body || {});
  await invoice.save();
  res.json({ invoice });
});

invoicesRouter.delete('/:id', async (req: Request, res: Response) => {
  const { tenant_id } = (req as any).auth as { tenant_id: string };
  const invoice = await Models.Invoice.findOne({ where: { id: req.params.id, tenant_id } });
  if (!invoice) return res.status(404).json({ error: 'Not found' });
  await invoice.destroy();
  res.status(204).send();
});

