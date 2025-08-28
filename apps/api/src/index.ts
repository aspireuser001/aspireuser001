import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { sequelize } from './lib/sequelize.js';
import { registerModels } from './models/index.js';
import { authRouter } from './routes/auth.js';
import { tenantRouter } from './routes/tenants.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true, credentials: true }));
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

app.use('/auth', authRouter);
app.use('/tenants', tenantRouter);

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const port = Number(process.env.PORT || 4000);

async function start() {
  registerModels();
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${port}`);
  });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', error);
  process.exit(1);
});

