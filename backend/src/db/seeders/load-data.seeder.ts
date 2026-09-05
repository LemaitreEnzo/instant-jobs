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
        slug: "acme-corp",
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
        slug: "globex-inc",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // --- Campus (2 pour Acme, 0 pour Globex → teste une orga sans campus) ---
    await queryInterface.bulkInsert("Campus", [
      {
        name: "Acme Campus Nord",
        slug: "acme-campus-nord",
        organizationSlug: "acme-corp",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Acme Campus Sud",
        slug: "acme-campus-sud",
        organizationSlug: "acme-corp",
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
        password_hash: "$2b$10$exempleHashBcrypt1",
        organizationSlug: "acme-corp",
        campusSlug: "acme-campus-nord",
        createdAt: now,
        updatedAt: now,
      },
      {
        firstname: "Marie",
        lastname: "Curie",
        email: "marie.curie@acme-corp.com",
        phone: "0622222222",
        password_hash: "$2b$10$exempleHashBcrypt2",
        organizationSlug: "acme-corp",
        campusSlug: null, // user sans campus
        createdAt: now,
        updatedAt: now,
      },
      {
        firstname: "Paul",
        lastname: "Martin",
        email: "paul.martin@globex.com",
        phone: "0633333333",
        password_hash: "$2b$10$exempleHashBcrypt3",
        organizationSlug: "globex-inc",
        campusSlug: null, // Globex n'a pas de campus
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
        userId: 1, // application sans user rattaché
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
        slug: "promo-2026-nord",
        name: "Promotion 2026 - Nord",
        campusSlug: "acme-campus-nord",
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: "promo-2026-sud",
        name: "Promotion 2026 - Sud",
        campusSlug: "acme-campus-sud",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // --- Specialities ---
    await queryInterface.bulkInsert("Speciality", [
      {
        slug: "dev-web",
        name: "Développement Web",
        promotionSlug: "promo-2026-nord",
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: "data-science",
        name: "Data Science",
        promotionSlug: "promo-2026-sud",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // --- SubSpecialities ---
    await queryInterface.bulkInsert("SubSpeciality", [
      {
        name: "Frontend",
        slug: "frontend",
        specialitySlug: "dev-web",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Backend",
        slug: "backend",
        specialitySlug: "dev-web",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Machine Learning",
        slug: "machine-learning",
        specialitySlug: "data-science",
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
