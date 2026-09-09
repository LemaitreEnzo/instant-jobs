import { QueryInterface } from "sequelize";

/** @type {import("sequelize-cli").Migration} */
export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const now = new Date();

    // --- Organizations ---
    await queryInterface.bulkInsert("Organization", [
      {
        name: "Acme Corp",
        email: "contact@acme-corp.com",
        phone: "0100000001",
        role: "recruiter",
        postcode: 60200,
        city: "Compiègne",
        adress: "12 rue des Entrepreneurs",
        country: "France",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Globex Inc",
        email: "contact@globex.com",
        phone: "0100000002",
        role: "school",
        postcode: 75001,
        city: "Paris",
        adress: "1 avenue des Champs",
        country: "France",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "La manu",
        email: "contact@lamanu.fr",
        phone: "010000002",
        role: "school",
        postcode: 75001,
        city: "Paris",
        adress: "1 avenue des Champs",
        country: "France",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // --- Campus (2 pour Acme, 0 pour Globex → teste une orga sans campus) ---
    await queryInterface.bulkInsert("Campus", [
      {
        name: "Acme Campus Nord",
        organizationId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Acme Campus Sud",
        organizationId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Compiègne",
        organizationId: 3,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // --- Users (avec et sans campus, sur les deux orgas) ---
    await queryInterface.bulkInsert("User", [
      {
        firstname: "Jean",
        lastname: "Dupont",
        email: "jean.dupont@acme-corp.com",
        phone: "0611111111",
        role: "staff",
        password_hash: "$2b$10$exempleHashBcrypt1",
        organizationId: 1,
        campusId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        firstname: "Marie",
        lastname: "Curie",
        email: "marie.curie@acme-corp.com",
        phone: "0622222222",
        role: "admin",
        password_hash: "$2b$10$exempleHashBcrypt2",
        organizationId: 1,
        campusId: null, // user sans campus
        createdAt: now,
        updatedAt: now,
      },
      {
        firstname: "Paul",
        lastname: "Martin",
        email: "paul.martin@globex.com",
        phone: "0633333333",
        role: "admin",
        password_hash: "$2b$10$exempleHashBcrypt3",
        organizationId: 2,
        campusId: null, // Globex n'a pas de campus
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // --- Applications (avec et sans user) ---
    await queryInterface.bulkInsert("Application", [
      {
        title: "Développeur Full-Stack",
        type: "CDI",
        logo: "logo1.png",
        company: "Acme Corp",
        city: "Compiègne",
        date: "2026-09-01",
        status: "pending",
        resend: "no",
        description: "Poste de développeur full-stack.",
        userId: 1, // Jean Dupont
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Stage Marketing",
        type: "Stage",
        logo: "logo2.png",
        company: "Globex Inc",
        city: "Paris",
        date: "2026-10-15",
        status: "accepted",
        resend: "no",
        description: "Stage marketing digital.",
        userId: 1,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // --- Media (rattaché uniquement à des users) ---
    await queryInterface.bulkInsert("Media", [
      {
        name: "CV Jean Dupont",
        path: "/uploads/cv-jean-dupont.pdf",
        userId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Photo de profil Marie",
        path: "/uploads/photo-marie.jpg",
        userId: 2,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // --- Promotions (rattachées à des campus) ---
    await queryInterface.bulkInsert("Promotion", [
      {
        name: "Promotion 2026 - Nord",
        campusId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Promotion 2026 - Sud",
        campusId: 2,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // --- Specialities ---
    await queryInterface.bulkInsert("Speciality", [
      {
        name: "Développement Web",
        promotionId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Data Science",
        promotionId: 2,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // --- SubSpecialities ---
    await queryInterface.bulkInsert("SubSpeciality", [
      {
        name: "Frontend",
        specialityId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Backend",
        specialityId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Machine Learning",
        specialityId: 2,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete("SubSpeciality", {});
    await queryInterface.bulkDelete("Speciality", {});
    await queryInterface.bulkDelete("Promotion", {});
    await queryInterface.bulkDelete("Media", {});
    await queryInterface.bulkDelete("Application", {});
    await queryInterface.bulkDelete("User", {});
    await queryInterface.bulkDelete("Campus", {});
    await queryInterface.bulkDelete("Organization", {});
  },
};
