import Service from "../models/Service.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// Helpers Function
// So this function converts array like input into a Clean array
// When empty or invalid it return empty array i.e: [];
const parseJsonArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed;
      return typeof parsed === "string" ? [parsed] : [];
    } catch {
      return field
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
};

// So this function takes date-time slot strings and group them into a
// YYYY-MM-DD with the time
function normalizeSlotsToMap(slotStrings = []) {
  const map = {};
  slotStrings.forEach((raw) => {
    const m = raw.match(
      /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s*•\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i,
    );
    if (!m) {
      // Fallback: keep raw in an "unspecified" bucket
      map["unspecified"] = map["unspecified"] || [];
      map["unspecified"].push(raw);
      return;
    }
    const [, day, monShort, year, hour, minute, ampm] = m;
    const monthIdx = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ].findIndex((x) => x.toLowerCase() === monShort.toLowerCase());
    const mm = String(monthIdx + 1).padStart(2, "0");
    const dd = String(Number(day)).padStart(2, "0");
    const dateKey = `${year}-${mm}-${dd}`; // YYYY-MM-DD
    const timeStr = `${String(Number(hour)).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${ampm.toUpperCase()}`;
    map[dateKey] = map[dateKey] || [];
    map[dateKey].push(timeStr);
  });
  return map;
}

// Safely converts into number
const sanitizePrice = (v) =>
  Number(String(v ?? "0").replace(/[^\d.-]/g, "")) || 0;
const parseAvailability = (v) => {
  const s = String(v ?? "available").toLowerCase();
  return s === "available" || s === "true";
};

// To create a service
export async function createService(req, res) {
  try {
    const b = req.body || {};
    const instructions = parseJsonArrayField(b.instructions);
    const rawSlots = parseJsonArrayField(b.slots);
    const slots = normalizeSlotsToMap(rawSlots);
    const numericPrice = sanitizePrice(b.price);
    const available = parseAvailability(b.availability);

    let imageUrl = null;
    let imagePublicId = null;
    if (req.file) {
      try {
        const up = await uploadToCloudinary(req.file.path, "services");
        imageUrl = up?.secure_url || null;
        imagePublicId = up?.public_id || null;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
      }
    } // If the file is present it will be uploaded to services folder in the Cloudinary;

    const service = new Service({
      name: b.name,
      about: b.about || "",
      shortDescription: b.shortDescription || "",
      price: numericPrice,
      available,
      instructions,
      slots,
      imageUrl,
      imagePublicId,
    });
    const saved = await service.save();
    return res.status(201).json({
      success: true,
      data: saved,
      message: "Service Created",
    });
  } catch (err) {
    console.error("CreateService Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// To get all the services
export async function getServices(req, res) {
  try {
    const list = await Service.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      data: list,
    });
  } catch (err) {
    console.error("GetService Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// To get service by id
export async function getServiceById(req, res) {
  try {
    const { id } = req.params;

    const service = await Service.findById(id).lean();

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (err) {
    console.error("GetServiceById Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// To update a service
export async function updateService(req, res) {
  try {
    const { id } = req.params;

    const existing = await Service.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Service Not Found",
      });
    }

    const b = req.body || {};
    const updateData = {};

    // Update only provided fields
    if (b.name !== undefined) updateData.name = b.name;
    if (b.about !== undefined) updateData.about = b.about;
    if (b.shortDescription !== undefined)
      updateData.shortDescription = b.shortDescription;
    if (b.price !== undefined) updateData.price = sanitizePrice(b.price);
    if (b.availability !== undefined)
      updateData.available = parseAvailability(b.availability);
    if (b.instructions !== undefined)
      updateData.instructions = parseJsonArrayField(b.instructions);
    if (b.slots !== undefined)
      updateData.slots = normalizeSlotsToMap(parseJsonArrayField(b.slots));

    // Image upload
    if (req.file) {
      try {
        const up = await uploadToCloudinary(req.file.path, "services");

        if (up?.secure_url) {
          updateData.imageUrl = up.secure_url;
          updateData.imagePublicId = up.public_id || null;

          if (existing.imagePublicId) {
            try {
              await deleteFromCloudinary(existing.imagePublicId);
            } catch (err) {
              console.warn("Cloudinary delete failed:", err?.message || err);
            }
          }
        }
      } catch (err) {
        console.error("Cloudinary upload error:", err);
      }
    }

    const updated = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      data: updated,
      message: "Service Updated",
    });
  } catch (err) {
    console.error("UpdateService Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// To delete a service
export async function deleteService(req, res) {
  try {
    const { id } = req.params;

    const existing = await Service.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Service Not Found",
      });
    }

    // Delete image from Cloudinary
    if (existing.imagePublicId) {
      try {
        await deleteFromCloudinary(existing.imagePublicId);
      } catch (err) {
        console.warn(
          "Failed to delete image from Cloudinary:",
          err?.message || err,
        );
      }
    }

    // Delete from DB
    await existing.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Service Deleted.",
    });
  } catch (err) {
    console.error("DeleteService Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
