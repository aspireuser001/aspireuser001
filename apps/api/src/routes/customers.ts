import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Models } from '../models/index.js';

export const customersRouter = Router();

customersRouter.use(requireAuth);

customersRouter.get('/', async (req: Request, res: Response) => {
  const { tenant_id } = (req as any).auth as { tenant_id: string };
  const customers = await Models.Customer.findAll({ where: { tenant_id }, order: [['created_at', 'DESC']] });
  res.json({ customers });
});

customersRouter.post('/', async (req: Request, res: Response) => {
  const { tenant_id } = (req as any).auth as { tenant_id: string };
  const { name, email, phone, billing_address, shipping_address } = req.body;
  const created = await Models.Customer.create({ tenant_id, name, email, phone, billing_address, shipping_address });
  res.status(201).json({ customer: created });
});

customersRouter.get('/:id', async (req: Request, res: Response) => {
  const { tenant_id } = (req as any).auth as { tenant_id: string };
  const customer = await Models.Customer.findOne({ where: { id: req.params.id, tenant_id } });
  if (!customer) return res.status(404).json({ error: 'Not found' });
  res.json({ customer });
});

customersRouter.patch('/:id', async (req: Request, res: Response) => {
  const { tenant_id } = (req as any).auth as { tenant_id: string };
  const customer = await Models.Customer.findOne({ where: { id: req.params.id, tenant_id } });
  if (!customer) return res.status(404).json({ error: 'Not found' });
  const { name, email, phone, billing_address, shipping_address } = req.body;
  if (name !== undefined) customer.name = name;
  if (email !== undefined) customer.email = email;
  if (phone !== undefined) customer.phone = phone;
  if (billing_address !== undefined) customer.billing_address = billing_address;
  if (shipping_address !== undefined) customer.shipping_address = shipping_address;
  await customer.save();
  res.json({ customer });
});

customersRouter.delete('/:id', async (req: Request, res: Response) => {
  const { tenant_id } = (req as any).auth as { tenant_id: string };
  const customer = await Models.Customer.findOne({ where: { id: req.params.id, tenant_id } });
  if (!customer) return res.status(404).json({ error: 'Not found' });
  await customer.destroy();
  res.status(204).send();
});

