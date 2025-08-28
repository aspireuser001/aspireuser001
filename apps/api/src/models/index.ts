import { sequelize } from '../lib/sequelize.js';
import { UserFactory } from './user.js';
import { TenantFactory } from './tenant.js';

export const Models = {
  User: UserFactory(sequelize),
  Tenant: TenantFactory(sequelize)
};

export function registerModels() {
  const { User, Tenant } = Models;

  Tenant.hasMany(User, { foreignKey: 'tenant_id', as: 'users' });
  User.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
}

