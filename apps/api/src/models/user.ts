import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export type UserRole = 'owner' | 'admin' | 'manager' | 'accountant' | 'sales' | 'employee';

export interface UserAttributes {
  id: string;
  tenant_id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: UserRole;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export type UserCreationAttributes = Optional<UserAttributes, 'id' | 'role'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public tenant_id!: string;
  public email!: string;
  public password_hash!: string;
  public full_name!: string;
  public role!: UserRole;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

export function UserFactory(sequelize: Sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      tenant_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('owner', 'admin', 'manager', 'accountant', 'sales', 'employee'),
        allowNull: false,
        defaultValue: 'employee'
      }
    },
    { sequelize, tableName: 'users' }
  );

  return User;
}

