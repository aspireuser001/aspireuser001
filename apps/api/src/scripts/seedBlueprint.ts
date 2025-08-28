import 'dotenv/config';
import { sequelize } from '../lib/sequelize.js';
import { registerModels, Models } from '../models/index.js';
import bcrypt from 'bcryptjs';

async function main() {
  const code = process.env.BLUEPRINT_CODE;
  if (!code) throw new Error('BLUEPRINT_CODE not provided');

  registerModels();
  await sequelize.authenticate();
  await sequelize.sync();

  if (code === 'bc-56eba2cc-81e8-46bf-a37d-db943ddca5a7') {
    const t = await sequelize.transaction();
    try {
      const tenant = await Models.Tenant.create({ name: 'BusinessOS Demo Co' }, { transaction: t });

      const adminPass = await bcrypt.hash('demo1234', 10);
      await Models.User.create({
        tenant_id: tenant.id,
        email: 'owner@demo.local',
        full_name: 'Demo Owner',
        password_hash: adminPass,
        role: 'owner'
      }, { transaction: t });

      const acme = await Models.Customer.create({ tenant_id: tenant.id, name: 'Acme Corp', email: 'ap@acme.com' }, { transaction: t });
      const globex = await Models.Customer.create({ tenant_id: tenant.id, name: 'Globex Inc', email: 'billing@globex.com' }, { transaction: t });

      const q1 = await Models.Quotation.create({
        tenant_id: tenant.id,
        customer_id: acme.id,
        number: 'Q-1001',
        issue_date: new Date(),
        currency: 'USD',
        subtotal: 1000,
        tax_total: 80,
        total: 1080,
        notes: 'Thanks for considering BusinessOS.'
      }, { transaction: t });

      await Models.Invoice.create({
        tenant_id: tenant.id,
        customer_id: acme.id,
        quotation_id: q1.id,
        number: 'INV-2001',
        issue_date: new Date(),
        due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        currency: 'USD',
        subtotal: 1000,
        tax_total: 80,
        total: 1080,
        notes: 'Payment due in 30 days.'
      }, { transaction: t });

      await Models.Quotation.create({
        tenant_id: tenant.id,
        customer_id: globex.id,
        number: 'Q-1002',
        issue_date: new Date(),
        currency: 'USD',
        subtotal: 5000,
        tax_total: 400,
        total: 5400
      }, { transaction: t });

      await t.commit();
      // eslint-disable-next-line no-console
      console.log('Seed completed for demo blueprint');
    } catch (e) {
      await t.rollback();
      throw e;
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('Unknown BLUEPRINT_CODE, nothing to seed');
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

