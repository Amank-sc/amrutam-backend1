import Consultation from "../models/consultation.js";
import Prescription from "../models/prescription.js";

// Update Consultation Status
export const updateConsultationStatus = async (req, res) => {
  try {
    const { consultationId, status } = req.body;
    const validStatus = ["pending", "confirmed", "completed", "cancelled"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const consultation = await Consultation.findByPk(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    consultation.status = status;
    await consultation.save();

    res.json({ message: "Status updated", consultation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Prescription
import Doctor from "../models/doctor.js"; // make sure model exists

export const addPrescription = async (req, res) => {
  try {
    const { consultationId, medicines, notes } = req.body;

    // Find the doctor profile
    const doctorProfile = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctorProfile) return res.status(400).json({ message: "Doctor profile not found" });

    // Find the consultation
    const consultation = await Consultation.findByPk(consultationId);
    if (!consultation || consultation.status !== "completed") {
      return res.status(400).json({ message: "Consultation not completed or not found" });
    }

    // Create prescription
    const prescription = await Prescription.create({
      consultationId,
      doctorId: doctorProfile.id, // use doctor profile id
      patientId: consultation.patientId,
      medicines,
      notes
    });

    res.status(201).json({ message: "Prescription added", prescription });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin analytics
export const getAdminAnalytics = async (req, res) => {
  try {
    const total = await Consultation.count();
    const pending = await Consultation.count({ where: { status: "pending" } });
    const completed = await Consultation.count({ where: { status: "completed" } });
    const cancelled = await Consultation.count({ where: { status: "cancelled" } });

    res.json({ total, pending, completed, cancelled });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

