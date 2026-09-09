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
  foreignKey: "organizationId",
  sourceKey: "id",
});
Campus.belongsTo(Organization, {
  foreignKey: "organizationId",
  targetKey: "id",
});

// Organization <-> User
Organization.hasMany(User, {
  foreignKey: "organizationId",
  sourceKey: "id",
});
User.belongsTo(Organization, {
  foreignKey: "organizationId",
  targetKey: "id",
});

// Campus <-> User
Campus.hasMany(User, { foreignKey: "campusId", sourceKey: "id" });
User.belongsTo(Campus, { foreignKey: "campusId", targetKey: "id" });

// User <-> Application
User.hasMany(Application, { foreignKey: "userId", sourceKey: "id" });
Application.belongsTo(User, { foreignKey: "userId", targetKey: "id" });

// User <-> Media
User.hasMany(Media, { foreignKey: "userId", sourceKey: "id" });
Media.belongsTo(User, { foreignKey: "userId", targetKey: "id" });

// Campus <-> Promotion
Campus.hasMany(Promotion, { foreignKey: "campusId", sourceKey: "id" });
Promotion.belongsTo(Campus, { foreignKey: "campusId", targetKey: "id" });

// Promotion <-> Speciality
Promotion.hasMany(Speciality, {
  foreignKey: "promotionId",
  sourceKey: "id",
});
Speciality.belongsTo(Promotion, {
  foreignKey: "promotionId",
  targetKey: "id",
});

// Speciality <-> SubSpeciality
Speciality.hasMany(SubSpeciality, {
  foreignKey: "specialityId",
  sourceKey: "id",
});
SubSpeciality.belongsTo(Speciality, {
  foreignKey: "specialityId",
  targetKey: "id",
});
