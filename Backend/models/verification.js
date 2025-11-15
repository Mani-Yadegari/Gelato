import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  codeExpires: { type: Date, required: true },
  lastSent: Date,
});

export default mongoose.model("Verification", verificationSchema);
