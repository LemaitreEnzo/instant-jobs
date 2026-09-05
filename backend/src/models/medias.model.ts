import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

import { sequelize } from "../../config/db";

interface Media extends Model<
  InferAttributes<Media>,
  InferCreationAttributes<Media>
> {
  id: CreationOptional<number>;
  name: string;
  path: string;
  score: number;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
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
    score: {
      type: DataTypes.INTEGER,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "Media",
    freezeTableName: true,
  },
);
