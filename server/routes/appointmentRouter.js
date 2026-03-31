import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import {
  cancelAppointment,
  confirmPayment,
  updateAppointment,
  createAppointment,
  getAppointments,
  getAppointmentsByPatient,
  getStats,
  getAppointmentsByDoctor,
  getRegisteredUserCount
} from "../controllers/appointmentControllers.js";

const appointmentRouter = express.Router();

appointmentRouter.get("/", getAppointments);
appointmentRouter.get("/confirm", confirmPayment);
appointmentRouter.get("/stats/summary", getStats);

// Auth Routes
appointmentRouter.post("/", clerkMiddleware(), requireAuth(), createAppointment);
appointmentRouter.get("/me", clerkMiddleware(), requireAuth(), getAppointmentsByPatient);

appointmentRouter.get("/doctor/:doctorId", getAppointmentsByDoctor);

appointmentRouter.post("/:id/cancel", cancelAppointment);
appointmentRouter.get("/patients/count", getRegisteredUserCount);
appointmentRouter.put("/:id", updateAppointment);

export default appointmentRouter;