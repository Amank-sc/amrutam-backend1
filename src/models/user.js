import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Doctor from "./doctor.js";
import Availability from "./availability.js";
import Consultation from "./consultation.js";
import Prescription from "./prescription.js";


const User = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("user", "doctor", "admin"),
    defaultValue: "user",
  }
});

User.hasOne(Doctor, { foreignKey: "userId" });
Doctor.belongsTo(User, { foreignKey: "userId" });

Doctor.hasMany(Availability, { foreignKey: "doctorId" });
Availability.belongsTo(Doctor, { foreignKey: "doctorId" });

// Patient -> Consultation
User.hasMany(Consultation, { foreignKey: "patientId" });
Consultation.belongsTo(User, { foreignKey: "patientId" });

// Doctor -> Consultation
Doctor.hasMany(Consultation, { foreignKey: "doctorId" });
Consultation.belongsTo(Doctor, { foreignKey: "doctorId" });

// Availability -> Consultation
Availability.hasOne(Consultation, { foreignKey: "slotId" });
Consultation.belongsTo(Availability, { foreignKey: "slotId" });

// Consultation -> Prescription
Consultation.hasOne(Prescription, { foreignKey: "consultationId" });
Prescription.belongsTo(Consultation, { foreignKey: "consultationId" });

// Doctor -> Prescription
Doctor.hasMany(Prescription, { foreignKey: "doctorId" });
Prescription.belongsTo(Doctor, { foreignKey: "doctorId" });

// Patient (User) -> Prescription
User.hasMany(Prescription, { foreignKey: "patientId" });
Prescription.belongsTo(User, { foreignKey: "patientId" });

export default User;
