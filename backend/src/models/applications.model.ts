import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

import { sequelize } from "../../config/db";

interface Application extends Model<
  InferAttributes<Application>,
  InferCreationAttributes<Application>
> {
  id: CreationOptional<number>;
  title: string;
  type: string;
  logo: string;
  company: string;
  city: string;
  date: string;
  status: string;
  resend: string;
  description: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

export const Application = sequelize.define<Application>(
  "Application",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    logo: {
      type: DataTypes.STRING,
    },
    company: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    status: {
      type: DataTypes.STRING,
    },
    resend: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "Application",
    freezeTableName: true,
  },
);
