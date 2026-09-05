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
  slug: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  organizationSlug: ForeignKey<Organization["slug"]>;
}

export const Campus = sequelize.define<Campus>("Campus", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
  },
  slug: {
    unique: true,
    type: DataTypes.STRING,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  organizationSlug: {
    type: DataTypes.STRING,
    references: {
      model: Organization,
      key: "slug",
    },
  },
});
