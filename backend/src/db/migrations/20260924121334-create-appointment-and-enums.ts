import { DataTypes, QueryInterface } from "sequelize";

/** @type {import("sequelize-cli").Migration} */
export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    // 1. Create PostgreSQL ENUM types if they do not exist
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_Application_type" AS ENUM ('internship', 'apprenticeship');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_Application_status" AS ENUM ('pending', 'refused', 'accepted');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_Application_resend" AS ENUM ('follow up', 'interview completed', 'no follow up', 'not necessary');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_User_role" AS ENUM ('student', 'admin', 'staff');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_User_status" AS ENUM ('search', 'pending', 'found');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 2. Change columns in Application to use ENUMs
    await queryInterface.sequelize.query(`
      ALTER TABLE "Application"
        ALTER COLUMN "type" TYPE "enum_Application_type" USING "type"::"enum_Application_type",
        ALTER COLUMN "status" TYPE "enum_Application_status" USING "status"::"enum_Application_status",
        ALTER COLUMN "resend" TYPE "enum_Application_resend" USING "resend"::"enum_Application_resend";
    `);

    // 3. Change columns in User to use ENUMs
    await queryInterface.sequelize.query(`
      ALTER TABLE "User"
        ALTER COLUMN "role" TYPE "enum_User_role" USING "role"::"enum_User_role",
        ALTER COLUMN "status" TYPE "enum_User_status" USING "status"::"enum_User_status";
    `);

    // 4. Create Appointment table
    await queryInterface.createTable("Appointment", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      reason: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      applicationId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Application",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    // 1. Drop Appointment table
    await queryInterface.dropTable("Appointment");

    // 2. Revert columns to VARCHAR
    await queryInterface.sequelize.query(`
      ALTER TABLE "Application"
        ALTER COLUMN "type" TYPE VARCHAR(255) USING "type"::text,
        ALTER COLUMN "status" TYPE VARCHAR(255) USING "status"::text,
        ALTER COLUMN "resend" TYPE VARCHAR(255) USING "resend"::text;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "User"
        ALTER COLUMN "role" TYPE VARCHAR(255) USING "role"::text,
        ALTER COLUMN "status" TYPE VARCHAR(255) USING "status"::text;
    `);

    // 3. Drop ENUM types
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_Application_type" CASCADE;
      DROP TYPE IF EXISTS "enum_Application_status" CASCADE;
      DROP TYPE IF EXISTS "enum_Application_resend" CASCADE;
      DROP TYPE IF EXISTS "enum_User_role" CASCADE;
      DROP TYPE IF EXISTS "enum_User_status" CASCADE;
    `);
  },
};
