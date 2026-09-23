import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

import { sequelize } from "../../config/db";
import { Application } from "./applications.model";

export interface Appointement extends Model<
  InferAttributes<Appointement>,
  InferCreationAttributes<Appointement>
> {
  id: CreationOptional<number>;
  date: Date;
  reason: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  applicationId: ForeignKey<Application["id"]>;
}

export const Appointement = sequelize.define<Appointement>(
  "Appointement",
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
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: Application,
        key: "id",
      },
    },
  },
  {
    tableName: "Appointement",
    freezeTableName: true,
  },
);
