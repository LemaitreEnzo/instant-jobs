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
  slug: string;
  name: string;
  organisationId: number;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  campusSlug: ForeignKey<Campus["slug"]>;
}

export const Promotion = sequelize.define<Promotion>(
  "Promotion",
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
    organisationId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    campusSlug: {
      type: DataTypes.STRING,
      references: {
        model: Campus,
        key: "slug",
      },
    },
  },
  {
    tableName: "Promotion",
    freezeTableName: true,
  },
);
