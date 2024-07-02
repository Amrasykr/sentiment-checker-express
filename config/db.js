import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import mysql2 from 'mysql2';

dotenv.config();

const sequelizeOptions = {
  host: process.env.DB_HOST,
  dialect: "mysql",
};


if (sequelizeOptions.dialect === 'mysql') {
  sequelizeOptions.dialectModule = mysql2;
}

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  sequelizeOptions
);

export default db;
