import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

import { sequelize } from "../../config/db";

interface Promotion extends Model<
  InferAttributes<Promotion>,
  InferCreationAttributes<Promotion>
> {
  id: CreationOptional<number>;
  slug: string;
  name: string;
  organisationId: number;
}

export const Promotion = sequelize.define<Promotion>("Promotion", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  slug: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  organisationId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
});
