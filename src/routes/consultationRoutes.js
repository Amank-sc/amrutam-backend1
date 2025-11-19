import express from "express";
import { authMiddleware, authorizeRoles } from "../middlewares/authMiddleware.js";
import { updateConsultationStatus, addPrescription, getAdminAnalytics } from "../controllers/consultationController.js";

const router = express.Router();

// Update consultation status (doctor/admin)
router.put("/update-status", authMiddleware, authorizeRoles("doctor","admin"), updateConsultationStatus);

// Add prescription (doctor only)
router.post("/prescription", authMiddleware, authorizeRoles("doctor"), addPrescription);

// Admin analytics
router.get("/analytics", authMiddleware, authorizeRoles("admin"), getAdminAnalytics);

export default router;
