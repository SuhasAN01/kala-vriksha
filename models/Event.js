import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ["online", "offline"], required: true },
    classLink: { type: String, default: "" }, // For online receipt/PDF
    image: { type: String, default: "" },
    venue: { type: String }, // For offline
    driveLink: { type: String }, // For online
    whatsappLink: { type: String, default: "" }, // For offline WhatsApp group
    preacher: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
