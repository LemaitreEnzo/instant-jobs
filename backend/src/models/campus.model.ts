import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

import { sequelize } from "../../config/db";
import { Organization } from "./organizations.model";

export interface Campus extends Model<
  InferAttributes<Campus>,
  InferCreationAttributes<Campus>
> {
  id: CreationOptional<number>;
  name: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  organizationId: ForeignKey<Organization["id"]>;
}

export const Campus = sequelize.define<Campus>(
  "Campus",
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
    organizationId: {
      type: DataTypes.INTEGER,
      references: {
        model: Organization,
        key: "id",
      },
    },
  },
  { tableName: "Campus", freezeTableName: true },
);
