import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

import { sequelize } from "../../config/db";
import { Promotion } from "./promotions.model";

export interface Speciality extends Model<
  InferAttributes<Speciality>,
  InferCreationAttributes<Speciality>
> {
  id: CreationOptional<number>;
  name: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  promotionId: ForeignKey<Promotion["id"]>;
}

export const Speciality = sequelize.define<Speciality>(
  "Speciality",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    promotionId: {
      type: DataTypes.INTEGER,
      references: {
        model: Promotion,
        key: "id",
      },
    },
  },
  {
    tableName: "Speciality",
    freezeTableName: true,
  },
);
