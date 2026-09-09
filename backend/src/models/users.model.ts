import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

import { sequelize } from "../../config/db";
import { Campus } from "./campus.model";
import { Organization } from "./organizations.model";
export interface User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  id: CreationOptional<number>;
  uuid: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  password_hash: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  organizationId: ForeignKey<Organization["id"]>;
  campusId: ForeignKey<Campus["id"]> | null;
}

export const User = sequelize.define<User>(
  "User",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    firstname: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lastname: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    phone: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    password_hash: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    organizationId: {
      type: DataTypes.INTEGER,
      references: {
        model: Organization,
        key: "id",
      },
    },
    campusId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: Campus,
        key: "id",
      },
    },
  },
  {
    tableName: "User",
    freezeTableName: true,
  },
);
