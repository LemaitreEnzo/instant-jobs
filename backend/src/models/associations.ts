import { Application } from "./applications.model";
import { Campus } from "./campus.model";
import { Media } from "./medias.model";
import { Organization } from "./organizations.model";
import { Promotion } from "./promotions.model";
import { Speciality } from "./specialities.model";
import { SubSpeciality } from "./subSpecialities.model";
import { User } from "./users.model";

// Organization <-> Campus
Organization.hasMany(Campus, {
  foreignKey: "organizationSlug",
  sourceKey: "slug",
});
Campus.belongsTo(Organization, {
  foreignKey: "organizationSlug",
  targetKey: "slug",
});

// Organization <-> User
Organization.hasMany(User, {
  foreignKey: "organizationSlug",
  sourceKey: "slug",
});
User.belongsTo(Organization, {
  foreignKey: "organizationSlug",
  targetKey: "slug",
});

// Campus <-> User
Campus.hasMany(User, { foreignKey: "campusSlug", sourceKey: "slug" });
User.belongsTo(Campus, { foreignKey: "campusSlug", targetKey: "slug" });

// User <-> Application
User.hasMany(Application, { foreignKey: "userId", sourceKey: "id" });
Application.belongsTo(User, { foreignKey: "userId", targetKey: "id" });

// User <-> Media
User.hasMany(Media, { foreignKey: "userId", sourceKey: "id" });
Media.belongsTo(User, { foreignKey: "userId", targetKey: "id" });

// Campus <-> Promotion
Campus.hasMany(Promotion, { foreignKey: "campusSlug", sourceKey: "slug" });
Promotion.belongsTo(Campus, { foreignKey: "campusSlug", targetKey: "slug" });

// Promotion <-> Speciality
Promotion.hasMany(Speciality, {
  foreignKey: "promotionSlug",
  sourceKey: "slug",
});
Speciality.belongsTo(Promotion, {
  foreignKey: "promotionSlug",
  targetKey: "slug",
});

// Speciality <-> SubSpeciality
Speciality.hasMany(SubSpeciality, {
  foreignKey: "specialitySlug",
  sourceKey: "slug",
});
SubSpeciality.belongsTo(Speciality, {
  foreignKey: "specialitySlug",
  targetKey: "slug",
});
