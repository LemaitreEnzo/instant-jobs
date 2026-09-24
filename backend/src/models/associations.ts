import { Application } from "./applications.model";
import { Appointement } from "./appointements.model";
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

// Promotion <-> User
Promotion.hasMany(User, { foreignKey: "promotionId", sourceKey: "id" });
User.belongsTo(Promotion, { foreignKey: "promotionId", targetKey: "id" });

// Speciality <-> User
Speciality.hasMany(User, { foreignKey: "specialityId", sourceKey: "id" });
User.belongsTo(Speciality, { foreignKey: "specialityId", targetKey: "id" });

// SubSpeciality <-> User
SubSpeciality.hasMany(User, { foreignKey: "subSpecialityId", sourceKey: "id" });
User.belongsTo(SubSpeciality, {
  foreignKey: "subSpecialityId",
  targetKey: "id",
});

// User <-> Application
User.hasMany(Application, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "applications",
});
Application.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
  as: "user",
});

// User <-> Media
User.hasMany(Media, { foreignKey: "userId", sourceKey: "id", as: "medias" });
Media.belongsTo(User, { foreignKey: "userId", targetKey: "id", as: "user" });

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

// Application <-> Appointement
Application.hasMany(Appointement, {
  foreignKey: "applicationId",
  sourceKey: "id",
});
Appointement.belongsTo(Application, {
  foreignKey: "applicationId",
  targetKey: "id",
});
