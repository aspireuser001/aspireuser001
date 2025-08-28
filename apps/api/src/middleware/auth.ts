import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthJwtPayload {
  sub: string;
  tenant_id: string;
  role: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = header.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthJwtPayload;
    (req as any).auth = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = (req as any).auth as AuthJwtPayload | undefined;
    if (!auth) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(auth.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

