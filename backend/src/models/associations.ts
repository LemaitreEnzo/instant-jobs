import { Application } from "./application.model";
import { Appointment } from "./appointment.model";
import { Campus } from "./campus.model";
import { Media } from "./media.model";
import { Organization } from "./organization.model";
import { Promotion } from "./promotion.model";
import { Speciality } from "./speciality.model";
import { SubSpeciality } from "./subSpeciality.model";
import { User } from "./user.model";

// Organization <-> Campus
Organization.hasMany(Campus, {
  foreignKey: "organizationId",
  sourceKey: "id",
  as: "campus",
});
Campus.belongsTo(Organization, {
  foreignKey: "organizationId",
  targetKey: "id",
  as: "organizations",
});

// Organization <-> User
Organization.hasMany(User, {
  foreignKey: "organizationId",
  sourceKey: "id",
  as: "users",
});
User.belongsTo(Organization, {
  foreignKey: "organizationId",
  targetKey: "id",
  as: "organizations",
});

// Campus <-> User
Campus.hasMany(User, {
  foreignKey: "campusId",
  sourceKey: "id",
  as: "users",
});
User.belongsTo(Campus, {
  foreignKey: "campusId",
  targetKey: "id",
  as: "campus",
});

// Promotion <-> User
Promotion.hasMany(User, {
  foreignKey: "promotionId",
  sourceKey: "id",
  as: "users",
});
User.belongsTo(Promotion, {
  foreignKey: "promotionId",
  targetKey: "id",
  as: "promotion",
});

// Speciality <-> User
Speciality.hasMany(User, {
  foreignKey: "specialityId",
  sourceKey: "id",
  as: "users",
});
User.belongsTo(Speciality, {
  foreignKey: "specialityId",
  targetKey: "id",
  as: "speciality",
});

// SubSpeciality <-> User
SubSpeciality.hasMany(User, {
  foreignKey: "subSpecialityId",
  sourceKey: "id",
  as: "users",
});
User.belongsTo(SubSpeciality, {
  foreignKey: "subSpecialityId",
  targetKey: "id",
  as: "subSpeciality",
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
  as: "users",
});

// User <-> Media
User.hasMany(Media, { foreignKey: "userId", sourceKey: "id", as: "medias" });
Media.belongsTo(User, { foreignKey: "userId", targetKey: "id", as: "users" });

// User <-> Appointment
User.hasMany(Appointment, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "appointments",
});
Appointment.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
  as: "users",
});

// Campus <-> Promotion
Campus.hasMany(Promotion, { foreignKey: "campusId", sourceKey: "id" });
Promotion.belongsTo(Campus, {
  foreignKey: "campusId",
  targetKey: "id",
  as: "campus",
});

// Promotion <-> Speciality
Promotion.hasMany(Speciality, {
  foreignKey: "promotionId",
  sourceKey: "id",
  as: "speciality",
});
Speciality.belongsTo(Promotion, {
  foreignKey: "promotionId",
  targetKey: "id",
  as: "promotion",
});

// Speciality <-> SubSpeciality
Speciality.hasMany(SubSpeciality, {
  foreignKey: "specialityId",
  sourceKey: "id",
  as: "subSpeciality",
});
SubSpeciality.belongsTo(Speciality, {
  foreignKey: "specialityId",
  targetKey: "id",
  as: "speciality",
});

// Application <-> Appointment
Application.hasMany(Appointment, {
  foreignKey: "applicationId",
  sourceKey: "id",
  as: "appointments",
});
Appointment.belongsTo(Application, {
  foreignKey: "applicationId",
  targetKey: "id",
  as: "applications",
});
