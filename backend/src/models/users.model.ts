import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

import { sequelize } from "../../config/db";

interface UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  id: CreationOptional<number>;
  name: string;
}

export const UserModel = sequelize.define<UserModel>("User", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
  },
});
