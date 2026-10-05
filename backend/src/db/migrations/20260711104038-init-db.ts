import { DataTypes, literal, QueryInterface } from "sequelize";

/** @type {import("sequelize-cli").Migration} */
export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("Organization", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      slug: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      phone: {
        allowNull: true,
        unique: true,
        type: DataTypes.STRING,
      },
      logo: {
        allowNull: false,
        type: DataTypes.TEXT("long"),
      },
      role: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      postcode: {
        type: DataTypes.INTEGER,
      },
      city: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
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

    await queryInterface.createTable("Campus", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      organizationId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Organization",
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

    await queryInterface.createTable("Promotion", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      campusId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Campus",
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

    await queryInterface.createTable("Speciality", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      promotionId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Promotion",
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

    await queryInterface.createTable("SubSpeciality", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      specialityId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Speciality",
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

    await queryInterface.createTable("User", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: literal("gen_random_uuid()"),
        allowNull: false,
        unique: true,
      },
      firstname: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      role: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      lastname: {
        allowNull: false,
        type: DataTypes.STRING,
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
      organizationId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Organization",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      campusId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "Campus",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      promotionId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "Promotion",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      specialityId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "Speciality",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      subSpecialityId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "SubSpeciality",
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

    await queryInterface.createTable("Application", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      logo: {
        allowNull: false,
        type: DataTypes.TEXT("long"),
      },
      company: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      city: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      date: {
        allowNull: false,
        type: DataTypes.DATEONLY,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      resend: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
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

    await queryInterface.createTable("Media", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      path: {
        type: DataTypes.TEXT("long"),
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
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("Media", { cascade: true });
    await queryInterface.dropTable("Application", { cascade: true });
    await queryInterface.dropTable("User", { cascade: true });
    await queryInterface.dropTable("SubSpeciality", { cascade: true });
    await queryInterface.dropTable("Speciality", { cascade: true });
    await queryInterface.dropTable("Promotion", { cascade: true });
    await queryInterface.dropTable("Campus", { cascade: true });
    await queryInterface.dropTable("Organization", { cascade: true });
  },
};
