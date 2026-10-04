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
import { AppointmentStatus } from "./enums/appointment.enum";
import { User } from "./user.model";

export interface Appointment extends Model<
  InferAttributes<Appointment>,
  InferCreationAttributes<Appointment>
> {
  id: CreationOptional<number>;
  date: Date;
  reason: string;
  status: AppointmentStatus;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  applicationId: ForeignKey<Application["id"]>;
  userId: ForeignKey<User["id"]>;
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
    status: {
      allowNull: false,
      type: DataTypes.ENUM(...Object.values(AppointmentStatus)),
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
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "Appointment",
    freezeTableName: true,
  },
);
