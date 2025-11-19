import Doctor from "../models/doctor.js";
import Availability from "../models/availability.js";

// Create Doctor Profile
export const createDoctorProfile = async (req, res) => {
  try {
    const { specialization, experience, bio } = req.body;

    const doctor = await Doctor.create({
      userId: req.user.id,
      specialization,
      experience,
      bio,
    });

    res.status(201).json({
      message: "Doctor profile created",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Set Availability
export const setAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;

    // Find doctor row for logged-in user
    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    // Create availability slot
    const slot = await Availability.create({
      doctorId: doctor.id, // <--- Use doctor.id, NOT req.user.id
      date,
      startTime,
      endTime,
    });

    res.status(201).json({
      message: "Availability added",
      slot,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all availability for logged-in doctor
export const getMyAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const slots = await Availability.findAll({
      where: { doctorId: doctor.id }   // use doctor.id
    });

    res.json(slots);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

