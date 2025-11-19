import { Sequelize } from "sequelize";
import Consultation from "../models/consultation.js";
import Availability from "../models/availability.js";
import Doctor from "../models/doctor.js";
import sequelize from "../config/db.js";

export const bookConsultation = async (req, res) => {
  const t = await sequelize.transaction(); // START TRANSACTION
  try {
    const { doctorId, slotId, notes } = req.body;
    const patientId = req.user.id;

    // Check if slot exists
    const slot = await Availability.findOne({ where: { id: slotId, doctorId }, transaction: t });
    if (!slot) {
      await t.rollback();
      return res.status(404).json({ message: "Slot not found" });
    }

    // Check if slot already booked
    const existing = await Consultation.findOne({ where: { slotId }, transaction: t });
    if (existing) {
      await t.rollback();
      return res.status(400).json({ message: "Slot already booked" });
    }

    // Create consultation
    const consultation = await Consultation.create({
      patientId,
      doctorId,
      slotId,
      status: "pending",
      notes
    }, { transaction: t });

    await t.commit(); // COMMIT TRANSACTION
    res.status(201).json({ message: "Consultation booked", consultation });

  } catch (error) {
    await t.rollback(); // ROLLBACK ON ERROR
    res.status(500).json({ message: error.message });
  }
};
