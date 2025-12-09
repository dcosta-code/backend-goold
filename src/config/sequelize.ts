import { Sequelize } from "sequelize";
import { env } from "./env";

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: env.db.host,
  port: env.db.port,
  database: env.db.name,
  username: env.db.user,
  password: env.db.password,
  logging: env.isDevelopment ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    throw error;
  }
};
