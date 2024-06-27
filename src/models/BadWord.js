import { Sequelize } from "sequelize";
import db from "../../config/db.js";

const { DataTypes } = Sequelize;

const BadWord = db.define(
  "bad_word",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "bad_word",
  }
);

export default BadWord;
