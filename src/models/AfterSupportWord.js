import { Sequelize } from "sequelize";
import db from "../../config/db.js";

const { DataTypes } = Sequelize;

const AfterSupportWord = db.define(
  "AfterSupportWord",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    word: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "after_support_word",
  }
);

export default AfterSupportWord;
