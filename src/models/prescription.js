import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Prescription = sequelize.define("prescription", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  consultationId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  medicines: {
    type: DataTypes.JSON, // e.g., [{name:"Paracetamol", dose:"500mg"}]
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT
  }
});

export default Prescription;
