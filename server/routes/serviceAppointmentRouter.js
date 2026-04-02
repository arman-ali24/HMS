import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";

import {
  getAllServiceAppointments,
  getServiceAppointmentById,
  createServiceAppointment,
  updateServiceAppointment,
  deleteServiceAppointment,
} from "../controllers/serviceAppointmentController.js";
