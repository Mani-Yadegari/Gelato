import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String },
    lastName: { type: String },
    code: { type: String },
    codeExpires: { type: Date },

    // ✅ آدرس کاربر
    address: {
      title: { type: String },
      description: { type: String },
      extraDesc: { type: String },
      lat: { type: Number },
      lng: { type: Number },
      googleUrl: { type: String },
      neshanUrl: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
