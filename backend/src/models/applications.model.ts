import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

import { sequelize } from "../../config/db";
import {
  ApplicationResend,
  ApplicationStatus,
  ApplicationType,
} from "./enums/application.enum";
import { User } from "./users.model";

export interface Application extends Model<
  InferAttributes<Application>,
  InferCreationAttributes<Application>
> {
  id: CreationOptional<number>;
  title: string;
  type: ApplicationType;
  logo: string;
  company: string;
  city: string;
  date: string;
  status: ApplicationStatus;
  resend: ApplicationResend;
  description: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  userId: ForeignKey<User["id"]> | null;
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
      allowNull: false,
      type: DataTypes.ENUM(...Object.values(ApplicationType)),
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
      allowNull: false,
      type: DataTypes.ENUM(...Object.values(ApplicationStatus)),
    },
    resend: {
      allowNull: false,
      type: DataTypes.ENUM(...Object.values(ApplicationResend)),
    },
    description: {
      type: DataTypes.TEXT,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    userId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "Application",
    freezeTableName: true,
  },
);
