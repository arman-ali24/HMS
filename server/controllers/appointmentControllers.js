import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import dotenv from "dotenv";
import Stripe from "stripe";
import { getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/express";
dotenv.config();

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;
const MAJOR_ADMIN_ID = process.env.MAJOR_ADMIN_ID || null;
const stripe = STRIPE_KEY
  ? new Stripe(STRIPE_KEY, { apiVersion: "2023-10-16" })
  : null;

// HELPERS
// This function will return a finite number.
const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// This function will create the frontend url
const buildFrontendBase = (req) => {
  if (FRONTEND_URL) return FRONTEND_URL.replace(/\/$/, "");
  const origin = req.get("origin") || req.get("referer");
  if (origin) return origin.replace(/\/$/, "");
  const host = req.get("host");
  if (host) return `${req.protocol || "http"}://${host}`.replace(/\/$/, "");
  return null;
};

// This function will get the user from clerk and return the user details
function resolveClerkUserId(req) {
  try {
    const auth = req.auth || {};
    const fromReq =
      auth?.userId || auth?.user_id || auth?.user?.id || req.user?.id || null;
    if (fromReq) return fromReq;
    try {
      const serverAuth = getAuth ? getAuth(req) : null;
      return serverAuth?.userId || null;
    } catch (e) {
      return null;
    }
  } catch (e) {
    return null;
  }
}

// To getAppointments
export const getAppointments = async (req, res) => {
  try {
    const {
      doctorId,
      mobile,
      status,
      search = "",
      limit: limitRaw = 50,
      page: pageRaw = 1,
      patientClerkId,
      createdBy,
    } = req.query;
    const limit = Math.min(200, Math.max(1, parseInt(limitRaw, 10) || 50));
    const page = Math.max(1, parseInt(pageRaw, 10) || 1);
    const skip = (page - 1) * limit;

    // To filter
    const filter = {};
    if (doctorId) filter.doctorId = doctorId;
    if (mobile) filter.mobile = mobile;
    if (status) filter.status = status;
    if (patientClerkId) filter.createdBy = patientClerkId;
    if (createdBy) filter.createdBy = createdBy;
    if (search) {
      const re = new RegExp(search, "i");
      filter.$or = [{ patientName: re }, { mobile: re }, { notes: re }];
    }

    const items = await Appointment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("doctorId", "name specialization owner imageUrl image")
      .lean();

    const total = await Appointment.countDocuments(filter);
    return res.json({
      success: true,
      Appointments: items,
      meta: { page, limit, total, count: items.length },
    });
  } catch (err) {
    console.error("GetAppointments Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// To getAppointments By Patient
export const getAppointmentsByPatient = async (req, res) => {
  try {
    const queryCreatedBy = req.query.createdBy || null;
    const clerkUserId = req.auth?.userId || null;
    const resolvedCreatedBy = queryCreatedBy || clerkUserId || null;

    console.log(
      "resolvedCreatedBy (query or req.auth.userId):",
      resolvedCreatedBy,
    );

    if (!resolvedCreatedBy && !req.query.mobile) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const filter = {};
    if (resolvedCreatedBy) filter.createdBy = resolvedCreatedBy;
    if (req.query.mobile) filter.mobile = req.query.mobile;

    const appointments = await Appointment.find(filter)
      .sort({ date: 1, time: 1 })
      .lean();
    return res.json({ success: true, appointments });
  } catch (err) {
    console.error("GetAppointmentsByPatient Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// To create an appointment
export const createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      patientName,
      mobile,
      age = "",
      gender = "",
      date,
      time,
      fee,
      fees,
      notes = "",
      email,
      paymentMethod,
      owner: ownerFromBody = null,
      doctorName: doctorNameFromBody,
      speciality: specialityFromBody,
      doctorImageUrl: doctorImageUrlFromBody,
      doctorImagePublicId: doctorImagePublicIdFromBody,
    } = req.body || {};

    const clerkUserId = resolveClerkUserId(req);
    if (!clerkUserId)
      return res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });

    if (!doctorId || !patientName || !mobile || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const numericFee = safeNumber(fee ?? fees ?? 0);
    if (numericFee === null || numericFee < 0) {
      return res.status(400).json({
        success: false,
        message: "Fee must be a valid number.",
      });
    }

    // Duplicate booking prevention
    const existingBooking = await Appointment.findOne({
      doctorId,
      createdBy: clerkUserId,
      date: String(date),
      time: String(time),
      status: { $ne: "cancelled" },
    }).lean();

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message:
          "You already have an appointment with this doctor at the selected slot.",
      });
    }

    let doctor = null;
    try {
      doctor = await Doctor.findById(doctorId).lean();
    } catch (e) {
      console.warn("Doctor lookup failed:", e?.message || e);
    }
    if (!doctor)
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });

    // Resolve owner, names, images, etc.
    let resolvedOwner = ownerFromBody || doctor.owner || null;
    if (!resolvedOwner) resolvedOwner = MAJOR_ADMIN_ID || String(doctorId);

    const doctorName =
      (doctor.name && String(doctor.name).trim()) ||
      (doctorNameFromBody && String(doctorNameFromBody).trim()) ||
      "";
    const speciality =
      (doctor.specialization && String(doctor.specialization).trim()) ||
      (doctor.speciality && String(doctor.speciality).trim()) ||
      (specialityFromBody && String(specialityFromBody).trim()) ||
      "";

    const doctorImageUrl =
      (doctor.imageUrl && String(doctor.imageUrl).trim()) ||
      (doctor.image && String(doctor.image).trim()) ||
      (doctor.avatarUrl && String(doctor.avatarUrl).trim()) ||
      (doctor.profileImage &&
        doctor.profileImage.url &&
        String(doctor.profileImage.url).trim()) ||
      (doctorImageUrlFromBody && String(doctorImageUrlFromBody).trim()) ||
      "";

    const doctorImagePublicId =
      (doctor.imagePublicId && String(doctor.imagePublicId).trim()) ||
      (doctor.profileImage &&
        doctor.profileImage.publicId &&
        String(doctor.profileImage.publicId).trim()) ||
      (doctorImagePublicIdFromBody &&
        String(doctorImagePublicIdFromBody).trim()) ||
      "";

    const doctorImage = { url: doctorImageUrl, publicId: doctorImagePublicId };

    const base = {
      doctorId: String(doctor._id || doctorId),
      doctorName,
      speciality,
      doctorImage,
      patientName: String(patientName).trim(),
      mobile: String(mobile).trim(),
      age: age ? Number(age) : undefined,
      gender: gender ? String(gender) : "",
      date: String(date),
      time: String(time),
      fees: numericFee,
      status: "Pending",
      payment: {
        method: paymentMethod === "Cash" ? "Cash" : "Online",
        status: "Pending",
        amount: numericFee,
      },
      notes: notes || "",
      createdBy: clerkUserId, // For a particular id.
      owner: resolvedOwner,
      sessionId: null,
    };

    // Free appointment
    if (numericFee === 0) {
      const created = await Appointment.create({
        ...base,
        status: "Confirmed",
        payment: { method: base.payment.method, status: "Paid", amount: 0 },
        paidAt: new Date(),
      });
      return res
        .status(201)
        .json({ success: true, appointment: created, checkoutUrl: null });
    }

    // Cash payment
    if (paymentMethod === "Cash") {
      const created = await Appointment.create({
        ...base,
        status: "Pending",
        payment: { method: "Cash", status: "Pending", amount: numericFee },
      });
      return res
        .status(201)
        .json({ success: true, appointment: created, checkoutUrl: null });
    }

    // Online: Stripe
    if (!stripe)
      return res
        .status(500)
        .json({ success: false, message: "Stripe not configured on server" });

    const frontBase = buildFrontendBase(req);
    if (!frontBase) {
      return res
        .status(500)
        .json({
          success: false,
          message:
            "Frontend URL could not be determined. Set FRONTEND_URL or send Origin header.",
        });
    }

    const successUrl = `${frontBase}/appointment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${frontBase}/appointment/cancel`;

    let session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: email || undefined,
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `Appointment - ${String(patientName).slice(0, 40)}`,
              },
              unit_amount: Math.round(numericFee * 100),
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          doctorId: String(doctorId),
          doctorName: doctorName || "",
          speciality: speciality || "",
          patientName: base.patientName,
          mobile: base.mobile,
          clerkUserId: clerkUserId || "",
        },
      });
    } catch (stripeErr) {
      console.error("Stripe create session error:", stripeErr);
      const message =
        stripeErr?.raw?.message || stripeErr?.message || "Stripe error";
      return res
        .status(502)
        .json({
          success: false,
          message: `Payment provider error: ${message}`,
        });
    }

    try {
      const created = await Appointment.create({
        ...base,
        sessionId: session.id,
        payment: {
          ...base.payment,
          providerId: session.payment_intent || session.paymentIntent || null,
        },
        status: "Pending",
      });
      return res
        .status(201)
        .json({
          success: true,
          appointment: created,
          checkoutUrl: session.url || null,
        });
    } catch (dbErr) {
      console.error("DB error saving appointment after stripe session:", dbErr);
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to create appointment record",
        });
    }
  } catch (err) {
    console.error("createAppointment unexpected:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// To confirm the online payment and make it paid