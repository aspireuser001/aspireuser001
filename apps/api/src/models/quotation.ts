import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface QuotationAttributes {
  id: string;
  tenant_id: string;
  customer_id: string;
  number: string;
  issue_date: Date;
  valid_until?: Date | null;
  currency: string;
  subtotal: number;
  tax_total: number;
  total: number;
  status: QuotationStatus;
  notes?: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export type QuotationCreationAttributes = Optional<QuotationAttributes, 'id' | 'status' | 'tax_total' | 'subtotal' | 'total' | 'valid_until' | 'notes'>;

export class Quotation extends Model<QuotationAttributes, QuotationCreationAttributes> implements QuotationAttributes {
  public id!: string;
  public tenant_id!: string;
  public customer_id!: string;
  public number!: string;
  public issue_date!: Date;
  public valid_until?: Date | null;
  public currency!: string;
  public subtotal!: number;
  public tax_total!: number;
  public total!: number;
  public status!: QuotationStatus;
  public notes?: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

export function QuotationFactory(sequelize: Sequelize) {
  Quotation.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
      customer_id: { type: DataTypes.UUID, allowNull: false },
      number: { type: DataTypes.STRING, allowNull: false, unique: true },
      issue_date: { type: DataTypes.DATEONLY, allowNull: false },
      valid_until: { type: DataTypes.DATEONLY, allowNull: true },
      currency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'USD' },
      subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      tax_total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      status: { type: DataTypes.ENUM('draft', 'sent', 'accepted', 'rejected'), allowNull: false, defaultValue: 'draft' },
      notes: { type: DataTypes.TEXT, allowNull: true }
    },
    { sequelize, tableName: 'quotations' }
  );

  return Quotation;
}

