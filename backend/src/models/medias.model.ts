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
}

export const Media = sequelize.define<Media>("Media", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
  },
});
