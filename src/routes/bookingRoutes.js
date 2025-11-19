import express from "express";
import { authMiddleware, authorizeRoles } from "../middlewares/authMiddleware.js";
import { bookConsultation } from "../controllers/bookingController.js";

const router = express.Router();

// Only patients can book
router.post("/book", authMiddleware, authorizeRoles("user"), bookConsultation);

export default router;
