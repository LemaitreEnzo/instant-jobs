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

export interface Promotion extends Model<
  InferAttributes<Promotion>,
  InferCreationAttributes<Promotion>
> {
  id: CreationOptional<number>;
  name: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  campusId: ForeignKey<Campus["id"]>;
}

export const Promotion = sequelize.define<Promotion>(
  "Promotion",
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
    campusId: {
      type: DataTypes.INTEGER,
      references: {
        model: Campus,
        key: "id",
      },
    },
  },
  {
    tableName: "Promotion",
    freezeTableName: true,
  },
);
