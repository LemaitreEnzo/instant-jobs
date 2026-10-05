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
  slug: string;
  email: string;
  phone: string;
  logo: string;
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
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    slug: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    phone: {
      allowNull: true,
      unique: true,
      type: DataTypes.STRING,
    },
    logo: {
      allowNull: false,
      type: DataTypes.TEXT("long"),
      validate: {
        validateSize(value: string) {
          if (value) {
            const size: number = 10;
            const maxSizeBytes = size * 1024 * 1024; // octet to Mo

            const base64String = value.split(",")[1] || value;
            const paddingBytes = (base64String.match(/=/g) || []).length;
            const realSizeBytes = (base64String.length * 3) / 4 - paddingBytes;

            if (realSizeBytes > maxSizeBytes) {
              throw new Error(`The file is too large (maximum ${size} MB).`);
            }
          }
        },
      },
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
