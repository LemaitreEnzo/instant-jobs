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
        unique: true,
        type: DataTypes.STRING,
      },
      email: {
        unique: true,
        type: DataTypes.STRING,
      },
      phone: {
        unique: true,
        type: DataTypes.INTEGER,
      },
      role: {
        unique: true,
        type: DataTypes.STRING,
      },
      postcode: {
        unique: true,
        type: DataTypes.INTEGER,
      },
      city: {
        unique: true,
        type: DataTypes.STRING,
      },
      adress: {
        unique: true,
        type: DataTypes.STRING,
      },
      country: {
        unique: true,
        type: DataTypes.STRING,
      },
      slug: {
        unique: true,
        type: DataTypes.STRING,
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
        unique: true,
        type: DataTypes.STRING,
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
      score: {
        type: DataTypes.INTEGER,
      },
    });
    await queryInterface.createTable("Promotion", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      slug: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
    });
    await queryInterface.createTable("Speciality", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      slug: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
    });
    await queryInterface.createTable("SubSpeciality", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      slug: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("SubSpeciality");
    await queryInterface.dropTable("Speciality");
    await queryInterface.dropTable("Promotion");
    await queryInterface.dropTable("Media");
    await queryInterface.dropTable("Application");
    await queryInterface.dropTable("Campus");
    await queryInterface.dropTable("User");
    await queryInterface.dropTable("Organization");
  },
};
