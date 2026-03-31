import mongoose from "mongoose";

const serviceAppointmentSchema = new mongoose.Schema(
  {
    createdBy: {
      type: String,
      default: null,
      index: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      min: 0,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },

    // Service info
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    serviceName: {
      type: String,
      required: true,
    },

    serviceImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    fees: {
      type: Number,
      required: true,
      min: 0,
    },

    // Schedule info
    date: {
      type: String,
      required: true,
      index: true,
    },

    hour: {
      type: Number,
      required: true,
    },

    minute: {
      type: Number,
      required: true,
    },

    ampm: {
      type: String,
      enum: ["AM", "PM"],
      required: true,
    },

    // Appointment status
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Rescheduled", "Completed", "Canceled"],
      default: "Pending",
      index: true,
    },

    rescheduledTo: {
      date: { type: String },
      hour: { type: Number },
      minute: { type: Number },
      ampm: { type: String, enum: ["AM", "PM"] },
    },

    // Payment mode and status
    payment: {
      method: {
        type: String,
        enum: ["Cash", "Online"],
        default: "Cash",
      },

      status: {
        type: String,
        enum: ["Pending", "Paid", "Failed", "Refunded"],
        default: "Pending",
      },

      amount: {
        type: Number,
        required: true,
      },

      providerId: {
        type: String, // Stripe payment id
        default: "",
      },

      paidAt: {
        type: Date,
        default: null,
      },

      sessionId: {
        type: String, // Stripe checkout sessionId
        default: "",
        index: true,
      },

      meta: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
  },
  {
    timestamps: true,
  },
);

serviceAppointmentSchema.index({ date: 1, status: 1 });
serviceAppointmentSchema.index({ serviceId: 1 });
serviceAppointmentSchema.index({ "payment.sessionId": 1 });

const ServiceAppointment =
  mongoose.models.ServiceAppointment ||
  mongoose.model("ServiceAppointment", serviceAppointmentSchema);

export default ServiceAppointment;