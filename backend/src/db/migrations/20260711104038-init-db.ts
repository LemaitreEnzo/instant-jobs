import { DataTypes, QueryInterface } from "sequelize";

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
      role: {
        type: DataTypes.STRING,
      },
      postcode: {
        type: DataTypes.INTEGER,
      },
      city: {
        type: DataTypes.STRING,
      },
      adress: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      slug: {
        allowNull: false,
        unique: true,
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
      slug: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      organizationSlug: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {
          model: "Organization",
          key: "slug",
        },
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
      firstname: {
        allowNull: false,
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
      organizationSlug: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {
          model: "Organization",
          key: "slug",
        },
      },
      campusSlug: {
        allowNull: true,
        type: DataTypes.STRING,
        references: {
          model: "Campus",
          key: "slug",
        },
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
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      logo: {
        type: DataTypes.STRING,
      },
      company: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      date: {
        type: DataTypes.DATEONLY,
      },
      status: {
        type: DataTypes.STRING,
      },
      resend: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      userId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
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
        type: DataTypes.STRING,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
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
      slug: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      campusSlug: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {
          model: "Campus",
          key: "slug",
        },
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
      slug: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      promotionSlug: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {
          model: "Promotion",
          key: "slug",
        },
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
      slug: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      specialitySlug: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {
          model: "Speciality",
          key: "slug",
        },
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
    await queryInterface.dropTable("SubSpeciality");
    await queryInterface.dropTable("Speciality");
    await queryInterface.dropTable("Promotion");
    await queryInterface.dropTable("Media");
    await queryInterface.dropTable("Application");
    await queryInterface.dropTable("User");
    await queryInterface.dropTable("Campus");
    await queryInterface.dropTable("Organization");
  },
};
