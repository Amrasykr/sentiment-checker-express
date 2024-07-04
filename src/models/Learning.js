import { Sequelize } from "sequelize";
import db from "../../config/db.js";

const { DataTypes } = Sequelize;

const Learning = db.define(
  "Learning",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    before: {
      type: DataTypes.STRING,
    },
    badword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    after: {
      type: DataTypes.STRING,
    },
    narrative: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("neutral", "negative", "very negative"),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "learning",
  }
);

export default Learning;
