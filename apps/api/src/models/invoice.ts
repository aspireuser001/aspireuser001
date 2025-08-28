import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void';

export interface InvoiceAttributes {
  id: string;
  tenant_id: string;
  customer_id: string;
  quotation_id?: string | null;
  number: string;
  issue_date: Date;
  due_date?: Date | null;
  currency: string;
  subtotal: number;
  tax_total: number;
  total: number;
  status: InvoiceStatus;
  notes?: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export type InvoiceCreationAttributes = Optional<InvoiceAttributes, 'id' | 'status' | 'tax_total' | 'subtotal' | 'total' | 'due_date' | 'quotation_id' | 'notes'>;

export class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> implements InvoiceAttributes {
  public id!: string;
  public tenant_id!: string;
  public customer_id!: string;
  public quotation_id?: string | null;
  public number!: string;
  public issue_date!: Date;
  public due_date?: Date | null;
  public currency!: string;
  public subtotal!: number;
  public tax_total!: number;
  public total!: number;
  public status!: InvoiceStatus;
  public notes?: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

export function InvoiceFactory(sequelize: Sequelize) {
  Invoice.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      tenant_id: { type: DataTypes.UUID, allowNull: false },
      customer_id: { type: DataTypes.UUID, allowNull: false },
      quotation_id: { type: DataTypes.UUID, allowNull: true },
      number: { type: DataTypes.STRING, allowNull: false, unique: true },
      issue_date: { type: DataTypes.DATEONLY, allowNull: false },
      due_date: { type: DataTypes.DATEONLY, allowNull: true },
      currency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'USD' },
      subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      tax_total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      status: { type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'void'), allowNull: false, defaultValue: 'draft' },
      notes: { type: DataTypes.TEXT, allowNull: true }
    },
    { sequelize, tableName: 'invoices' }
  );

  return Invoice;
}

