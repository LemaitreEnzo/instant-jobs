import { DataTypes, QueryInterface } from "sequelize";
import {
  ApplicationResend,
  ApplicationStatus,
  ApplicationType,
} from "../../models/enums/application.enum";
import { AppointmentStatus } from "../../models/enums/appointment.enum";
import { OrganizationRole } from "../../models/enums/organization.enum";
import { StudentStatus, UserRole } from "../../models/enums/user.enum";

const ENUM_CONFIGS = [
  {
    table: "Application",
    column: "type",
    name: "enum_application_type",
    values: Object.values(ApplicationType),
  },
  {
    table: "Application",
    column: "status",
    name: "enum_application_status",
    values: Object.values(ApplicationStatus),
  },
  {
    table: "Application",
    column: "resend",
    name: "enum_application_resend",
    values: Object.values(ApplicationResend),
  },
  {
    table: "Appointment",
    column: "status",
    name: "enum_appointment_status",
    values: Object.values(AppointmentStatus),
  },
  {
    table: "User",
    column: "role",
    name: "enum_user_role",
    values: Object.values(UserRole),
  },
  {
    table: "User",
    column: "status",
    name: "enum_user_status",
    values: Object.values(StudentStatus),
  },
  {
    table: "Organization",
    column: "role",
    name: "enum_organization_role",
    values: Object.values(OrganizationRole),
  },
];

const ENUM_COLUMNS_BY_TABLE = ENUM_CONFIGS.reduce<
  Record<string, typeof ENUM_CONFIGS>
>((acc, config) => {
  (acc[config.table] ??= []).push(config);

  return acc;
}, {});

/** @type {import("sequelize-cli").Migration} */
export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    for (const config of ENUM_CONFIGS) {
      const formattedValues = config.values
        .map((v) => `'${v.replace(/'/g, "''")}'`)
        .join(", ");
      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${config.name}') THEN
            CREATE TYPE ${config.name} AS ENUM (${formattedValues});
          END IF;
        END $$;
      `);
    }

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
      status: {
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
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "User",
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

    for (const [table, configs] of Object.entries(ENUM_COLUMNS_BY_TABLE)) {
      const alterations = configs
        .map(
          ({ column, name }) =>
            `ALTER COLUMN "${column}" TYPE ${name} USING "${column}"::text::${name}`,
        )
        .join(",\n        ");

      await queryInterface.sequelize.query(`
        ALTER TABLE "${table}"
          ${alterations};
      `);
    }
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("Appointment");

    for (const [table, configs] of Object.entries(ENUM_COLUMNS_BY_TABLE)) {
      if (table === "Appointment") continue;

      const alterations = configs
        .map(
          ({ column }) =>
            `ALTER COLUMN "${column}" TYPE VARCHAR(255) USING "${column}"::text`,
        )
        .join(",\n        ");

      await queryInterface.sequelize.query(`
        ALTER TABLE "${table}"
          ${alterations};
      `);
    }

    const dropQueries = ENUM_CONFIGS.map(
      (config) => `DROP TYPE IF EXISTS "${config.name}" CASCADE;`,
    ).join("\n");
    await queryInterface.sequelize.query(dropQueries);
  },
};
