import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Models } from '../models/index.js';

export const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response) => {
  const { tenantName, fullName, email, password } = req.body as {
    tenantName: string; fullName: string; email: string; password: string;
  };
  if (!tenantName || !fullName || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  const t = await Models.Tenant.sequelize!.transaction();
  try {
    const tenant = await Models.Tenant.create({ name: tenantName }, { transaction: t });
    const password_hash = await bcrypt.hash(password, 10);
    const user = await Models.User.create({
      tenant_id: tenant.id,
      email,
      password_hash,
      full_name: fullName,
      role: 'owner'
    }, { transaction: t });

    await t.commit();

    const token = jwt.sign({ sub: user.id, tenant_id: tenant.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role }, tenant });
  } catch (e: any) {
    await t.rollback();
    res.status(400).json({ error: e.message || 'Failed to register' });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const user = await Models.User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: user.id, tenant_id: user.tenant_id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } });
});

