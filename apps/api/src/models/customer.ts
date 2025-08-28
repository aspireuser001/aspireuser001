import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface CustomerAttributes {
  id: string;
  tenant_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  billing_address?: string | null;
  shipping_address?: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export type CustomerCreationAttributes = Optional<CustomerAttributes, 'id'>;

export class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
  public id!: string;
  public tenant_id!: string;
  public name!: string;
  public email?: string | null;
  public phone?: string | null;
  public billing_address?: string | null;
  public shipping_address?: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

export function CustomerFactory(sequelize: Sequelize) {
  Customer.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      billing_address: { type: DataTypes.TEXT, allowNull: true },
      shipping_address: { type: DataTypes.TEXT, allowNull: true }
    },
    { sequelize, tableName: 'customers' }
  );

  return Customer;
}

