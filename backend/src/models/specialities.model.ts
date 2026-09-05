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
  slug: string;
  name: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  promotionSlug: ForeignKey<Promotion["slug"]>;
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
    promotionSlug: {
      type: DataTypes.STRING,
      references: {
        model: Promotion,
        key: "slug",
      },
    },
  },
  {
    tableName: "Speciality",
    freezeTableName: true,
  },
);
