import { QueryInterface, QueryTypes } from "sequelize";

/** @type {import("sequelize-cli").Migration} */
export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const now = new Date();

    // ==========================================
    // 1. ORGANIZATIONS (10 au total : 3 entreprises, 7 écoles)
    // ==========================================
    const rawOrganizations = [
      // --- 3 Entreprises ("recruiter") ---
      {
        name: "TechNova Solutions",
        email: "contact@technova.fr",
        phone: "0140000001",
        role: "recruiter",
        postcode: 75008,
        city: "Paris",
        adress: "25 rue de Ponthieu",
        country: "France",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "InnoWave Digital",
        email: "contact@innowave.io",
        phone: "0140000002",
        role: "recruiter",
        postcode: 69002,
        city: "Lyon",
        adress: "14 quai du Commerce",
        country: "France",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Nexora Conseil",
        email: "contact@nexora.fr",
        phone: "0140000003",
        role: "recruiter",
        postcode: 59000,
        city: "Lille",
        adress: "8 boulevard Carnot",
        country: "France",
        createdAt: now,
        updatedAt: now,
      },
      // --- 7 Écoles ("school") ---
      {
        name: "La Manu",
        email: "contact@lamanu.fr",
        phone: "0344000001",
        role: "school",
        postcode: 60200,
        city: "Compiègne",
        adress: "70 rue des Jacobins",
        country: "France",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "École Supérieure du Numérique (ESN)",
        email: "admission@esn-tech.fr",
        phone: "0140000004",
        role: "school",
        postcode: 75011,
        city: "Paris",
        adress: "42 rue de la Roquette",
        country: "France",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Institut Digital de France (IDF)",
        email: "contact@idf-digital.fr",
        phone: "0140000005",
        role: "school",
        postcode: 78000,
        city: "Versailles",
        adress: "15 avenue de Paris",
        country: "France",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Polytech Web & Data",
        email: "info@polytech-webdata.fr",
        phone: "0472000001",
        role: "school",
        postcode: 69007,
        city: "Lyon",
        adress: "20 boulevard des Belges",
        country: "France",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Aquitaine Tech Academy",
        email: "contact@aquitaine-tech.fr",
        phone: "0556000001",
        role: "school",
        postcode: 33000,
        city: "Bordeaux",
        adress: "5 cours Pasteur",
        country: "France",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Grand Ouest Coding School",
        email: "hello@grand-ouest-code.fr",
        phone: "0240000001",
        role: "school",
        postcode: 44000,
        city: "Nantes",
        adress: "12 rue de la Paix",
        country: "France",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Méditerranée Tech Campus",
        email: "contact@med-tech-campus.fr",
        phone: "0491000001",
        role: "school",
        postcode: 13001,
        city: "Marseille",
        adress: "30 rue de la République",
        country: "France",
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("Organization", rawOrganizations);

    const insertedOrgs = (await queryInterface.sequelize.query(
      `SELECT id, name, email, role FROM "Organization" ORDER BY id ASC;`,
      { type: QueryTypes.SELECT }
    )) as unknown as Array<{ id: number; name: string; email: string; role: string }>;

    const schoolOrgs = insertedOrgs.filter((org) => org.role === "school");

    // ==========================================
    // 2. CAMPUS (2 à 3 campus par orga école, 0 pour les entreprises)
    // ==========================================
    // 7 écoles : [3, 2, 3, 2, 3, 2, 3] = 18 campus au total
    const schoolCampusConfig: Record<string, string[]> = {
      "La Manu": ["Campus Compiègne", "Campus Amiens", "Campus Noyon"],
      "École Supérieure du Numérique (ESN)": ["Campus Paris Bastille", "Campus Montrouge"],
      "Institut Digital de France (IDF)": ["Campus Versailles", "Campus Saint-Quentin", "Campus Cergy"],
      "Polytech Web & Data": ["Campus Lyon Part-Dieu", "Campus Villeurbanne"],
      "Aquitaine Tech Academy": ["Campus Bordeaux Victoire", "Campus Mérignac", "Campus Pau"],
      "Grand Ouest Coding School": ["Campus Nantes Centre", "Campus Rennes"],
      "Méditerranée Tech Campus": ["Campus Marseille Joliette", "Campus Aix-en-Provence", "Campus Nice"],
    };

    const rawCampuses: Array<{
      name: string;
      organizationId: number;
      createdAt: Date;
      updatedAt: Date;
    }> = [];

    for (const school of schoolOrgs) {
      const campusNames = schoolCampusConfig[school.name] ?? [
        `Campus ${school.name} Nord`,
        `Campus ${school.name} Sud`,
      ];
      for (const campusName of campusNames) {
        rawCampuses.push({
          name: campusName,
          organizationId: school.id,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    await queryInterface.bulkInsert("Campus", rawCampuses);

    const insertedCampuses = (await queryInterface.sequelize.query(
      `SELECT id, name, "organizationId" FROM "Campus" ORDER BY id ASC;`,
      { type: QueryTypes.SELECT }
    )) as unknown as Array<{ id: number; name: string; organizationId: number }>;

    // ==========================================
    // 3. PROMOTIONS (3 à 4 promotions par campus)
    // ==========================================
    const promotionTemplates = [
      "Promotion 2024 - Développeur Web",
      "Promotion 2024 - Concepteur Développeur d'Applications",
      "Promotion 2025 - Mastère Architecte Logiciel",
      "Promotion 2025 - Mastère Data & IA",
      "Promotion 2026 - Bachelor Développeur Full-Stack",
      "Promotion 2026 - Mastère Cybersécurité & Cloud",
    ];

    const rawPromotions: Array<{
      name: string;
      campusId: number;
      createdAt: Date;
      updatedAt: Date;
    }> = [];

    for (let cIdx = 0; cIdx < insertedCampuses.length; cIdx++) {
      const campus = insertedCampuses[cIdx];
      if (!campus) continue;

      // Alterne 3 et 4 promotions par campus
      const promoCount = cIdx % 2 === 0 ? 4 : 3;

      for (let pIdx = 0; pIdx < promoCount; pIdx++) {
        const tplName = promotionTemplates[(cIdx * 2 + pIdx) % promotionTemplates.length] ?? "Promotion Tech";
        rawPromotions.push({
          name: `${tplName} - ${campus.name}`,
          campusId: campus.id,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    await queryInterface.bulkInsert("Promotion", rawPromotions);

    const insertedPromotions = (await queryInterface.sequelize.query(
      `SELECT id, name, "campusId" FROM "Promotion" ORDER BY id ASC;`,
      { type: QueryTypes.SELECT }
    )) as unknown as Array<{ id: number; name: string; campusId: number }>;

    // ==========================================
    // 4. SPÉCIALITÉS (2 spécialités par promotion)
    // ==========================================
    const specialityPairs: Array<[string, string]> = [
      ["Développement Web & Mobile", "Architecture Cloud & DevOps"],
      ["Data Science & Analytics", "Intelligence Artificielle & NLP"],
      ["Cybersécurité des SI", "Administration Systèmes & Réseaux"],
      ["Ingénierie Logicielle & Qualité", "Conception d'Applications Mobiles"],
      ["Design d'Expérience UI/UX", "Développement Frontend Avancé"],
      ["Gestion de Projet Numérique & Agile", "Architecture Microservices & API"],
    ];

    const rawSpecialities: Array<{
      name: string;
      promotionId: number;
      createdAt: Date;
      updatedAt: Date;
    }> = [];

    for (let pIdx = 0; pIdx < insertedPromotions.length; pIdx++) {
      const promo = insertedPromotions[pIdx];
      if (!promo) continue;

      const pair = specialityPairs[pIdx % specialityPairs.length] ?? [
        "Spécialité Ingénierie",
        "Spécialité Recherche & Développement",
      ];

      rawSpecialities.push({
        name: pair[0],
        promotionId: promo.id,
        createdAt: now,
        updatedAt: now,
      });
      rawSpecialities.push({
        name: pair[1],
        promotionId: promo.id,
        createdAt: now,
        updatedAt: now,
      });
    }

    await queryInterface.bulkInsert("Speciality", rawSpecialities);

    const insertedSpecialities = (await queryInterface.sequelize.query(
      `SELECT id, name, "promotionId" FROM "Speciality" ORDER BY id ASC;`,
      { type: QueryTypes.SELECT }
    )) as unknown as Array<{ id: number; name: string; promotionId: number }>;

    // ==========================================
    // 5. SUB-SPÉCIALITÉS (2 sub-spécialités par spécialité)
    // ==========================================
    const subSpecialityCatalog: Record<string, [string, string]> = {
      "Développement Web & Mobile": ["Frontend React & Next.js", "Backend Node.js & NestJS"],
      "Architecture Cloud & DevOps": ["Docker, Kubernetes & CI/CD", "Cloud AWS & Terraform"],
      "Data Science & Analytics": ["Data Engineering & Pipelines ETL", "Analyse Statistique & Power BI"],
      "Intelligence Artificielle & NLP": ["Machine Learning & Scikit-Learn", "Deep Learning & LLMs"],
      "Cybersécurité des SI": ["Tests d'Intrusion & Pentest", "Sécurité Réseau & Cryptographie"],
      "Administration Systèmes & Réseaux": ["Linux Server & Scripting Bash", "Virtualisation & Supervision"],
      "Ingénierie Logicielle & Qualité": ["Architecture Hexagonale & DDD", "Tests Automatisés & TDD"],
      "Conception d'Applications Mobiles": ["React Native Cross-Platform", "Swift & Kotlin Natif"],
      "Design d'Expérience UI/UX": ["Design System sur Figma", "Recherche & Tests Utilisateurs"],
      "Développement Frontend Avancé": ["TypeScript Avancé & Vue.js", "Performance Web & Webpack/Vite"],
      "Gestion de Projet Numérique & Agile": ["Méthodologie Scrum & Kanban", "Product Management & KPI"],
      "Architecture Microservices & API": ["API RESTful & GraphQL", "Message Broker Kafka / RabbitMQ"],
    };

    const rawSubSpecialities: Array<{
      name: string;
      specialityId: number;
      createdAt: Date;
      updatedAt: Date;
    }> = [];

    for (const spec of insertedSpecialities) {
      const subs = subSpecialityCatalog[spec.name] ?? [
        `${spec.name} - Niveau Fondations`,
        `${spec.name} - Niveau Avancé`,
      ];

      rawSubSpecialities.push({
        name: subs[0],
        specialityId: spec.id,
        createdAt: now,
        updatedAt: now,
      });
      rawSubSpecialities.push({
        name: subs[1],
        specialityId: spec.id,
        createdAt: now,
        updatedAt: now,
      });
    }

    await queryInterface.bulkInsert("SubSpeciality", rawSubSpecialities);

    // ==========================================
    // 6. USERS (10 users par organisation = 100 users au total)
    // ==========================================
    const firstnames = [
      "Jean", "Marie", "Paul", "Sophie", "Lucas", "Emma", "Thomas", "Léa", "Hugo", "Chloé",
      "Alexandre", "Camille", "Nicolas", "Sarah", "Julien", "Manon", "Maxime", "Inès", "Antoine", "Clara",
      "Romain", "Julie", "Clément", "Marine", "Guillaume", "Laura", "Quentin", "Pauline", "Mathieu", "Anaïs",
      "Florian", "Lucie", "Valentin", "Margaux", "Adrien", "Charlotte", "Paul", "Alice", "Bastien", "Juliette",
      "Théo", "Noémie", "Gabriel", "Océane", "Louis", "Léna", "Nathan", "Élodie", "Arthur", "Amélie",
      "Pierre", "Mélanie", "Enzo", "Eva", "Sébastien", "Justine", "Benoît", "Mathilde", "Rémi", "Romane",
      "Benjamin", "Lucile", "Damien", "Célia", "Kévin", "Agathe", "Simon", "Lou", "David", "Victoire",
      "Vincent", "Salomé", "Cédric", "Lisa", "Anthony", "Elsa", "Marc", "Capucine", "Franck", "Apolline",
      "Jérôme", "Rose", "Laurent", "Zoé", "Stéphane", "Héloïse", "Fabien", "Jeanne", "Olivier", "Alix",
      "Arnaud", "Iris", "Mickaël", "Roxane", "Thibault", "Coline", "Xavier", "Maëlys", "Yann", "Solène",
    ];

    const lastnames = [
      "Dupont", "Curie", "Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit", "Durand",
      "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel", "Garcia", "David", "Bertrand", "Roux",
      "Vincent", "Fournier", "Morel", "Girard", "Andre", "Lefevre", "Mercier", "Dupuis", "Lambert", "Bonnet",
      "Francois", "Martinez", "Legrand", "Garnier", "Faure", "Rousseau", "Blanc", "Guerin", "Muller", "Henry",
      "Roussel", "Nicolas", "Perrin", "Morin", "Mathieu", "Clement", "Gauthier", "Dumont", "Lopez", "Fontaine",
      "Chevalier", "Robin", "Masson", "Sanchez", "Gerard", "Nguyen", "Boyer", "Denis", "Lemaire", "Duval",
      "Joly", "Gautier", "Caron", "Picard", "Brun", "Verdier", "Gaillard", "Barbier", "Arnaud", "Rolland",
      "Leclerc", "Vidal", "Bourgeois", "Renaud", "Lemoine", "Picard", "Colin", "Cousin", "Aubry", "Giraud",
      "Marchand", "Benoit", "Rey", "Baron", "Guyot", "Leveque", "Pons", "Blanchard", "Peltier", "Boucher",
      "Perrot", "Gros", "Renard", "Roy", "Lebrun", "Colin", "Fernandez", "Moulin", "Vasseur", "Allard",
    ];

    const defaultPasswordHash = "$2b$10$epRnT3MmKsnsp1234567890abcdefghijklmnopqrstuvwxyz";

    const rawUsers: Array<{
      firstname: string;
      lastname: string;
      email: string;
      phone: string;
      role: string;
      password_hash: string;
      organizationId: number;
      campusId: number | null;
      createdAt: Date;
      updatedAt: Date;
    }> = [];

    let globalUserCounter = 0;

    for (const org of insertedOrgs) {
      const isSchool = org.role === "school";
      const orgCampuses = isSchool
        ? insertedCampuses.filter((c) => c.organizationId === org.id)
        : [];

      // 10 users par organisation
      for (let uIdx = 0; uIdx < 10; uIdx++) {
        globalUserCounter++;

        // Répartition des rôles :
        // 1 admin, 2 staff, 7 standard ("user")
        let role = "user";
        if (uIdx === 0) {
          role = "admin";
        } else if (uIdx === 1 || uIdx === 2) {
          role = "staff";
        }

        // Attribution du campus :
        // Les entreprises n'ont pas de campus (null)
        // Pour les écoles : l'admin n'a pas de campus rattaché (null = global), les autres sont répartis sur les campus de l'école
        let userCampusId: number | null = null;
        if (isSchool && orgCampuses.length > 0 && uIdx > 0) {
          const targetCampus = orgCampuses[(uIdx - 1) % orgCampuses.length];
          if (targetCampus) {
            userCampusId = targetCampus.id;
          }
        }

        const firstname = firstnames[(globalUserCounter - 1) % firstnames.length] ?? "Utilisateur";
        const lastname = lastnames[(globalUserCounter - 1) % lastnames.length] ?? `${globalUserCounter}`;
        const domain = org.email.split("@")[1] ?? "instantjobs.fr";
        const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}.${globalUserCounter}@${domain}`;
        const phone = `06${String(10000000 + globalUserCounter).padStart(8, "0")}`;

        rawUsers.push({
          firstname,
          lastname,
          email,
          phone,
          role,
          password_hash: defaultPasswordHash,
          organizationId: org.id,
          campusId: userCampusId,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    await queryInterface.bulkInsert("User", rawUsers);

    const insertedUsers = (await queryInterface.sequelize.query(
      `SELECT id, firstname, lastname, email, role, "organizationId" FROM "User" ORDER BY id ASC;`,
      { type: QueryTypes.SELECT }
    )) as unknown as Array<{
      id: number;
      firstname: string;
      lastname: string;
      email: string;
      role: string;
      organizationId: number;
    }>;

    // ==========================================
    // 7. APPLICATIONS & MEDIAS
    // ==========================================
    const studentUsers = insertedUsers.filter((u) => u.role === "user");
    const fallbackUserId = insertedUsers[0]?.id ?? 1;

    const rawApplications = [
      {
        title: "Développeur Full-Stack React / Node.js",
        type: "CDI",
        logo: "logo-technova.png",
        company: "TechNova Solutions",
        city: "Paris",
        date: "2026-09-01",
        status: "pending",
        resend: "no",
        description: "Poste de développeur full-stack au sein de l'équipe produit SaaS.",
        userId: studentUsers[0]?.id ?? fallbackUserId,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Stage Développeur Frontend Next.js",
        type: "Stage",
        logo: "logo-innowave.png",
        company: "InnoWave Digital",
        city: "Lyon",
        date: "2026-10-15",
        status: "accepted",
        resend: "no",
        description: "Stage de fin d'études en intégration web et optimisation de performance.",
        userId: studentUsers[1]?.id ?? fallbackUserId,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Alternance Data Engineer",
        type: "Alternance",
        logo: "logo-nexora.png",
        company: "Nexora Conseil",
        city: "Lille",
        date: "2026-09-15",
        status: "pending",
        resend: "no",
        description: "Création et maintenance de pipelines ETL temps-réel.",
        userId: studentUsers[2]?.id ?? fallbackUserId,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Consultant Cybersécurité Junior",
        type: "CDI",
        logo: "logo-technova.png",
        company: "TechNova Solutions",
        city: "Paris",
        date: "2026-11-01",
        status: "rejected",
        resend: "yes",
        description: "Audit de sécurité applicative et tests d'intrusion.",
        userId: studentUsers[3]?.id ?? fallbackUserId,
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Développeur Backend TypeScript / PostgreSQL",
        type: "CDI",
        logo: "logo-innowave.png",
        company: "InnoWave Digital",
        city: "Lyon",
        date: "2026-12-01",
        status: "pending",
        resend: "no",
        description: "Conception et implémentation d'APIs résilientes.",
        userId: studentUsers[4]?.id ?? fallbackUserId,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("Application", rawApplications);

    const rawMedias = [
      {
        name: "CV - Développeur Web",
        path: "/uploads/cv-dev-web.pdf",
        userId: studentUsers[0]?.id ?? fallbackUserId,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Photo de profil",
        path: "/uploads/photo-profil-1.jpg",
        userId: studentUsers[0]?.id ?? fallbackUserId,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Portfolio PDF",
        path: "/uploads/portfolio-projets.pdf",
        userId: studentUsers[1]?.id ?? fallbackUserId,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "CV - Data Engineer",
        path: "/uploads/cv-data-engineer.pdf",
        userId: studentUsers[2]?.id ?? fallbackUserId,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("Media", rawMedias);
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

    const tables = [
      "SubSpeciality",
      "Speciality",
      "Promotion",
      "Media",
      "Application",
      "User",
      "Campus",
      "Organization",
    ];

    for (const table of tables) {
      await queryInterface.sequelize.query(
        `ALTER SEQUENCE IF EXISTS "${table}_id_seq" RESTART WITH 1;`
      );
    }
  },
};
