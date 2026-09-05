import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

import { sequelize } from "../../config/db";
import { User } from "./users.model";

export interface Media extends Model<
  InferAttributes<Media>,
  InferCreationAttributes<Media>
> {
  id: CreationOptional<number>;
  name: string;
  path: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  userId: ForeignKey<User["id"]>;
}

export const Media = sequelize.define<Media>(
  "Media",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    path: {
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "Media",
    freezeTableName: true,
  },
);
