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
import { Organization } from "./organizations.model";
export interface User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  id: CreationOptional<number>;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password_hash: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  organizationSlug: ForeignKey<Organization["slug"]>;
  campusSlug: ForeignKey<Campus["slug"]> | null;
}

export const User = sequelize.define<User>(
  "User",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    firstname: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lastname: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    phone: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    password_hash: {
      allowNull: false,
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
    campusSlug: {
      allowNull: true,
      type: DataTypes.STRING,
      references: {
        model: Campus,
        key: "slug",
      },
    },
  },
  {
    tableName: "User",
    freezeTableName: true,
  },
);

User.belongsTo(Campus, {
  foreignKey: "campusSlug",
  targetKey: "slug",
});
