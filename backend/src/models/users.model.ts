import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

import { sequelize } from "../../config/db";

interface User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  id: CreationOptional<number>;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password_hash: string;
  organisation_id: number;
}

export const User = sequelize.define<User>("User", {
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
  organisation_id: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
});
