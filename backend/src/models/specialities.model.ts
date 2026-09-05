import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

import { sequelize } from "../../config/db";

interface Speciality extends Model<
  InferAttributes<Speciality>,
  InferCreationAttributes<Speciality>
> {
  id: CreationOptional<number>;
  slug: string;
  name: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

export const Speciality = sequelize.define<Speciality>(
  "Speciality",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    slug: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "Specility",
    freezeTableName: true,
  },
);
