import { sequelize } from '../lib/sequelize.js';
import { UserFactory } from './user.js';
import { TenantFactory } from './tenant.js';
import { CustomerFactory } from './customer.js';
import { QuotationFactory } from './quotation.js';
import { InvoiceFactory } from './invoice.js';

export const Models = {
  User: UserFactory(sequelize),
  Tenant: TenantFactory(sequelize),
  Customer: CustomerFactory(sequelize),
  Quotation: QuotationFactory(sequelize),
  Invoice: InvoiceFactory(sequelize)
};

export function registerModels() {
  const { User, Tenant, Customer, Quotation, Invoice } = Models;

  Tenant.hasMany(User, { foreignKey: 'tenant_id', as: 'users' });
  User.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

  Tenant.hasMany(Customer, { foreignKey: 'tenant_id', as: 'customers' });
  Customer.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

  Tenant.hasMany(Quotation, { foreignKey: 'tenant_id', as: 'quotations' });
  Quotation.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
  Customer.hasMany(Quotation, { foreignKey: 'customer_id', as: 'quotations' });
  Quotation.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

  Tenant.hasMany(Invoice, { foreignKey: 'tenant_id', as: 'invoices' });
  Invoice.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
  Customer.hasMany(Invoice, { foreignKey: 'customer_id', as: 'invoices' });
  Invoice.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
  Quotation.hasOne(Invoice, { foreignKey: 'quotation_id', as: 'invoice' });
  Invoice.belongsTo(Quotation, { foreignKey: 'quotation_id', as: 'quotation' });
}

