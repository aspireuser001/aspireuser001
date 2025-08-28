import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export interface TenantAttributes {
  id: string;
  name: string;
  domain?: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export type TenantCreationAttributes = Optional<TenantAttributes, 'id'>;

export class Tenant extends Model<TenantAttributes, TenantCreationAttributes> implements TenantAttributes {
  public id!: string;
  public name!: string;
  public domain?: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

export function TenantFactory(sequelize: Sequelize) {
  Tenant.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      domain: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    { sequelize, tableName: 'tenants' }
  );

  return Tenant;
}

