import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
  {
    // ObjectId refs for populate
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },

    // Snapshot fields - always stored for display fallback
    transactionId: { type: String, required: true },
    paymentScreenshot: { type: String },
    paymentStatus: { type: String, enum: ["pending", "verified"], default: "pending" },

    // Denormalized snapshot fields (stored at registration time)
    eventName: { type: String },
    eventDate: { type: String },
    userName: { type: String },
    userEmail: { type: String },
    userPhone: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Registration || mongoose.model("Registration", RegistrationSchema);
