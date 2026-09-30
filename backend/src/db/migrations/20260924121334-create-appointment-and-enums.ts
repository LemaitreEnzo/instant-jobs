import { DataTypes, QueryInterface } from "sequelize";

/** @type {import("sequelize-cli").Migration} */
export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE enum_application_type AS ENUM ('internship', 'apprenticeship');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE enum_application_status AS ENUM ('pending', 'refused', 'accepted');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE enum_application_resend AS ENUM ('follow up', 'interview completed', 'no follow up', 'not necessary');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE enum_user_role AS ENUM ('student', 'admin', 'staff');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE enum_user_status AS ENUM ('search', 'pending', 'found');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE enum_organization_role AS ENUM ('company', 'school');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Application"
        ALTER COLUMN "type" TYPE enum_application_type USING "type"::enum_application_type,
        ALTER COLUMN "status" TYPE enum_application_status USING "status"::enum_application_status,
        ALTER COLUMN "resend" TYPE enum_application_resend USING "resend"::enum_application_resend;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "User"
        ALTER COLUMN "role" TYPE enum_user_role USING "role"::enum_user_role,
        ALTER COLUMN "status" TYPE enum_user_status USING "status"::enum_user_status;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Organization"
        ALTER COLUMN "role" TYPE enum_organization_role USING "role"::enum_organization_role;
    `);

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
    await queryInterface.dropTable("Appointment");

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

    await queryInterface.sequelize.query(`
      ALTER TABLE "Organization"
        ALTER COLUMN "role" TYPE VARCHAR(255) USING "role"::text;
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_application_type" CASCADE;
      DROP TYPE IF EXISTS "enum_application_status" CASCADE;
      DROP TYPE IF EXISTS "enum_application_resend" CASCADE;
      DROP TYPE IF EXISTS "enum_user_role" CASCADE;
      DROP TYPE IF EXISTS "enum_user_status" CASCADE;
      DROP TYPE IF EXISTS "enum_organization_role" CASCADE;
    `);
  },
};
