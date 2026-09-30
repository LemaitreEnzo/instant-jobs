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
  phone: string;
  logo: string;
  description: string;
  role: string;
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
    description: {
      type: DataTypes.TEXT,
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
      type: DataTypes.STRING,
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
