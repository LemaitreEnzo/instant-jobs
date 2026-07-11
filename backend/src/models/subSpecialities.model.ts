import { sequelize } from "config/db";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

interface SubSpeciality extends Model<
  InferAttributes<SubSpeciality>,
  InferCreationAttributes<SubSpeciality>
> {
  id: CreationOptional<number>;
  name: string;
  slug: string;
  specialityId: number;
}

export const SubSpeciality = sequelize.define<SubSpeciality>("SubSpeciality", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  slug: {
    unique: true,
    allowNull: false,
    type: DataTypes.STRING,
  },
  specialityId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
});
