import type {
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { DataTypes } from "sequelize";

import { sequelize } from "../../config/db";
import { Campus } from "./campus.model";
import { StudentStatus, UserRole } from "./enums/user.enum";
import { Organization } from "./organizations.model";
import { Promotion } from "./promotions.model";
import { Speciality } from "./specialities.model";
import { SubSpeciality } from "./subSpecialities.model";

export interface User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  id: CreationOptional<number>;
  uuid: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: UserRole;
  status: StudentStatus | null;
  password_hash: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  organizationId: ForeignKey<Organization["id"]>;
  campusId: ForeignKey<Campus["id"]> | null;
  promotionId: ForeignKey<Promotion["id"]> | null;
  specialityId: ForeignKey<Speciality["id"]> | null;
  subSpecialityId: ForeignKey<SubSpeciality["id"]> | null;
}

export const User = sequelize.define<User>(
  "User",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    firstname: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    role: {
      allowNull: false,
      type: DataTypes.ENUM(...Object.values(UserRole)),
    },
    lastname: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(StudentStatus)),
      allowNull: true,
      validate: {
        validateStatusByRole(value: StudentStatus | null) {
          const user = this as unknown as User;

          if (user.role === UserRole.STUDENT && !value) {
            throw new Error(
              `Status is required for users with the '${UserRole.STUDENT}' role.`,
            );
          }
          if (user.role !== UserRole.STUDENT && value !== null) {
            throw new Error(
              `Status must be null if the user role is not '${UserRole.STUDENT}'.`,
            );
          }
        },
      },
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    phone: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    password_hash: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    organizationId: {
      type: DataTypes.INTEGER,
      references: {
        model: Organization,
        key: "id",
      },
    },
    campusId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: Campus,
        key: "id",
      },
    },
    promotionId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: Promotion,
        key: "id",
      },
    },
    specialityId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: Speciality,
        key: "id",
      },
    },
    subSpecialityId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: SubSpeciality,
        key: "id",
      },
    },
  },
  {
    tableName: "User",
    freezeTableName: true,
  },
);
