import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

import { sequelize } from "../../config/db";
import { User } from "./user.model";

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
      type: DataTypes.TEXT("long"),
      validate: {
        validateSize(value: string) {
          if (value) {
            const size: number = 10;
            const maxSizeBytes = size * 1024 * 1024; // octet to Mo

            const base64String = value.split(",")[1] || value;
            const paddingBytes = (base64String.match(/=/g) || []).length;
            const realSizeBytes = (base64String.length * 3) / 4 - paddingBytes;

            if (realSizeBytes > maxSizeBytes) {
              throw new Error(`The file is too large (maximum ${size} MB).`);
            }
          }
        },
      },
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
