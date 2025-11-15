import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  openingHour: { type: String, default: "09:00" },
  closingHour: { type: String, default: "23:00" },
  siteActive: { type: Boolean, default: true },
});

export default mongoose.model("Settings", settingsSchema);
