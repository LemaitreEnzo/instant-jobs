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
    email: string;
    phone: number;
    role: string;
    postcode: number;
    city: string;
    adress: string;
    country: string;
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
    email: {
        unique: true,
        type: DataTypes.STRING
    },
    phone: {
        unique: true,
        type: DataTypes.INTEGER
    },
    role: {
        unique: true,
        type: DataTypes.STRING
    },
    postcode: {
        unique: true,
        type: DataTypes.INTEGER
    },
    city: {
        unique: true,
        type: DataTypes.STRING
    },
    adress: {
        unique: true,
        type: DataTypes.STRING
    },
    country: {
        unique: true,
        type: DataTypes.STRING
    },
    slug: {
        unique: true,
        type: DataTypes.STRING
    },
});