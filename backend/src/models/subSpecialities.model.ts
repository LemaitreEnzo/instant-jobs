import { sequelize } from "config/db";
import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Speciality } from "./specialities.model";

export interface SubSpeciality extends Model<
  InferAttributes<SubSpeciality>,
  InferCreationAttributes<SubSpeciality>
> {
  id: CreationOptional<number>;
  name: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  specialityId: ForeignKey<Speciality["id"]>;
}

export const SubSpeciality = sequelize.define<SubSpeciality>(
  "SubSpeciality",
  {
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    specialityId: {
      type: DataTypes.INTEGER,
      references: {
        model: Speciality,
        key: "id",
      },
    },
  },
  {
    tableName: "SubSpeciality",
    freezeTableName: true,
  },
);
