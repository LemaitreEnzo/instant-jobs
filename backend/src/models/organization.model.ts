import { sequelize } from "config/db";

import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

import { OrganizationRole } from "./enums/organization.enum";

export interface Organization extends Model<
  InferAttributes<Organization>,
  InferCreationAttributes<Organization>
> {
  id: CreationOptional<number>;
  name: string;
  email: string;
  phone: string;
  role: OrganizationRole;
  description: string;
  postcode: number;
  city: string;
  address: string;
  country: string;
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
      allowNull: false,
      type: DataTypes.ENUM(...Object.values(OrganizationRole)),
    },
    description: {
      type: DataTypes.TEXT,
    },
    postcode: {
      type: DataTypes.INTEGER,
    },
    city: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    country: {
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
