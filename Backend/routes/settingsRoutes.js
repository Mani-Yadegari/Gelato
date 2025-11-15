import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// 🔹 تعریف اسکیمای تنظیمات
const settingsSchema = new mongoose.Schema({
  openingHour: { type: String, default: "09:00" },
  closingHour: { type: String, default: "23:00" },
  siteActive: { type: Boolean, default: true }, // اضافه شد
});

// 🔹 مدل Settings
const Settings =
  mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

// 📌 دریافت تنظیمات فعلی
router.get("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(); // اگر وجود نداشت، پیش‌فرض بساز
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 💾 ذخیره تنظیمات
router.post("/", async (req, res) => {
  const { openingHour, closingHour, siteActive } = req.body;

  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ openingHour, closingHour, siteActive });
    } else {
      settings.openingHour = openingHour;
      settings.closingHour = closingHour;
      settings.siteActive = siteActive;
    }
    await settings.save();
    res.json({ message: "تنظیمات با موفقیت ذخیره شد" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
