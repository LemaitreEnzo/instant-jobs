import { sequelize } from "config/db";

import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

export interface Organization extends Model<
  InferAttributes<Organization>,
  InferCreationAttributes<Organization>
> {
  id: CreationOptional<number>;
  name: string;
  email: string;
  phone: number;
  role: string;
  postcode: number;
  city: string;
  adress: string;
  country: string;
  slug: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

export const Organization = sequelize.define<Organization>(
  "Organization",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    name: {
      unique: true,
      type: DataTypes.STRING,
    },
    email: {
      unique: true,
      type: DataTypes.STRING,
    },
    phone: {
      allowNull: true,
      unique: true,
      type: DataTypes.STRING,
    },
    role: {
      unique: true,
      type: DataTypes.STRING,
    },
    postcode: {
      unique: true,
      type: DataTypes.INTEGER,
    },
    city: {
      unique: true,
      type: DataTypes.STRING,
    },
    adress: {
      unique: true,
      type: DataTypes.STRING,
    },
    country: {
      unique: true,
      type: DataTypes.STRING,
    },
    slug: {
      unique: true,
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "Organization",
    freezeTableName: true,
  },
);
