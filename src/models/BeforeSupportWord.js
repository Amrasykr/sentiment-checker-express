import { Sequelize } from "sequelize";
import db from "../../config/db.js";

const { DataTypes } = Sequelize;

const BeforeSupportWord = db.define(
  "BeforeSupportWord",
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
    tableName: "before_support_word",
  }
);

export default BeforeSupportWord;
