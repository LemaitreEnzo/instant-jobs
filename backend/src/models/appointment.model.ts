import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

import { sequelize } from "../../config/db";
import { Application } from "./application.model";

export interface Appointment extends Model<
  InferAttributes<Appointment>,
  InferCreationAttributes<Appointment>
> {
  id: CreationOptional<number>;
  date: Date;
  reason: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  applicationId: ForeignKey<Application["id"]>;
}

export const Appointment = sequelize.define<Appointment>(
  "Appointment",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    applicationId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Application,
        key: "id",
      },
    },
  },
  {
    tableName: "Appointment",
    freezeTableName: true,
  },
);
