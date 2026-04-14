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
}

export const Organization = sequelize.define<Organization>("Organization", {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING
    }
});