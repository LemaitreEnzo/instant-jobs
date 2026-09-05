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
  slug: string;
  specialityId: number;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  specialitySlug: ForeignKey<Speciality["slug"]>;
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
    slug: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING,
    },
    specialityId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    specialitySlug: {
      type: DataTypes.STRING,
      references: {
        model: Speciality,
        key: "slug",
      },
    },
  },
  {
    tableName: "SubSpeciality",
    freezeTableName: true,
  },
);
