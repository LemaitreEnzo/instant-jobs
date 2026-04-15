import { sequelize } from "config/db";

import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

interface Organization extends Model<
InferAttributes<Organization>,
InferCreationAttributes<Organization>
> {
    id: CreationOptional<number>,
    name: string;
    slug: string;
}

export const Organization = sequelize.define<Organization>("Organization", {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    name: {
        unique: true,
        type: DataTypes.STRING
    },
    slug: {
        unique: true,
        type: DataTypes.STRING
    },
});