import { Sequelize } from 'sequelize';

const dialect = (process.env.DB_DIALECT || 'postgres').toLowerCase();

export const sequelize =
  dialect === 'sqlite'
    ? new Sequelize({
        dialect: 'sqlite',
        storage: process.env.SQLITE_STORAGE || './data/dev.sqlite',
        logging: false,
        define: { underscored: true, paranoid: true }
      })
    : new Sequelize(process.env.DATABASE_URL as string, {
        dialect: 'postgres',
        logging: false,
        define: { underscored: true, paranoid: true }
      });

