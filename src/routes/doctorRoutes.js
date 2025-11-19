import express from "express";
import { authMiddleware, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  createDoctorProfile,
  setAvailability,
  getMyAvailability
} from "../controllers/doctorController.js";

const router = express.Router();

// only logged-in doctors allowed
router.post("/create-profile", authMiddleware, authorizeRoles("doctor"), createDoctorProfile);
router.post("/set-availability", authMiddleware, authorizeRoles("doctor"), setAvailability);
router.get("/my-availability", authMiddleware, authorizeRoles("doctor"), getMyAvailability);

export default router;
