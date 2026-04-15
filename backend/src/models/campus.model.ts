import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

import { sequelize } from "../../config/db";

interface Campus extends Model<
  InferAttributes<Campus>,
  InferCreationAttributes<Campus>
> {
  id: CreationOptional<number>;
  name: string,
  slug: string;
}

export const Campus = sequelize.define<Campus>("Campus", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
  },
  slug: {
    unique: true,
    type: DataTypes.STRING
  }
});
