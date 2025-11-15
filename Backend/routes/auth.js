import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Verification from "../models/verification.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const JWT_EXPIRES_IN = "7d";

const SMSIR_API_KEY = process.env.SMSIR_API_KEY;
const SMSIR_TEMPLATE_ID = process.env.SMSIR_TEMPLATE_ID;
const SMS_MODE = process.env.SMS_MODE || "sandbox"; // "sandbox" یا "live"

// ذخیره تعداد درخواست‌ها در بازه زمانی
const codeRequestLimits = {};
const LIMIT_COUNT = 5; // حداکثر دفعات
const LIMIT_WINDOW = 30 * 60 * 1000; // نیم ساعت

// Middleware برای چک کردن JWT
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// محدودیت درخواست کد
function canRequestCode(key) {
  const now = Date.now();
  if (!codeRequestLimits[key]) {
    codeRequestLimits[key] = { count: 1, startTime: now };
    return { allowed: true };
  }
  const { count, startTime } = codeRequestLimits[key];
  if (now - startTime > LIMIT_WINDOW) {
    codeRequestLimits[key] = { count: 1, startTime: now };
    return { allowed: true };
  }
  if (count < LIMIT_COUNT) {
    codeRequestLimits[key].count += 1;
    return { allowed: true };
  }
  const minutesLeft = Math.ceil((LIMIT_WINDOW - (now - startTime)) / 60000);
  return { allowed: false, minutesLeft };
}

// ارسال SMS با SMS.ir
async function sendSMSCode(phone, code) {
  if (SMS_MODE === "sandbox") {
    console.log(`[SANDBOX] Code for ${phone}: ${code}`);
    return { sandbox: true, code };
  }

  try {
    const response = await axios.post(
      "https://api.sms.ir/v1/send/verify",
      {
        mobile: phone,
        templateId: Number(SMSIR_TEMPLATE_ID),
        parameters: [{ name: "Code", value: code }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": SMSIR_API_KEY,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("SMS.ir error:", err.response?.data || err.message);
    throw new Error("خطا در ارسال پیامک");
  }
}

// ==========================
// مسیرها
// ==========================

// بررسی شماره موبایل
router.post("/check-phone", async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    return res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ورود
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ error: "کاربر پیدا نشد" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "رمز اشتباه است" });

    const token = jwt.sign({ id: user._id, phone: user.phone }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({ message: "Login successful", user, token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ارسال کد ثبت‌نام
router.post("/send-code", async (req, res) => {
  try {
    const { phone } = req.body;
    const check = canRequestCode(`register-${phone}`);
    if (!check.allowed) {
      return res
        .status(429)
        .json({ error: `لطفا ${check.minutesLeft} دقیقه دیگر تلاش کنید.` });
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    await Verification.findOneAndUpdate(
      { phone },
      { code, codeExpires: expires },
      { upsert: true, new: true }
    );

    const smsRes = await sendSMSCode(phone, code);
    res.json({ message: "کد ارسال شد ✅", smsRes });
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// بررسی کد
router.post("/verify-code", async (req, res) => {
  try {
    const { phone, code } = req.body;
    const record = await Verification.findOne({ phone });
    if (!record) return res.status(404).json({ error: "Code not found" });

    if (record.code !== code)
      return res.status(400).json({ error: "Invalid code" });
    if (record.codeExpires < new Date())
      return res.status(400).json({ error: "Code expired" });

    await Verification.deleteOne({ phone });
    res.json({ message: "Code verified", phone });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ثبت‌نام
router.post("/register", async (req, res) => {
  try {
    const { phone, password, name, lastName } = req.body;
    const existingUser = await User.findOne({ phone });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      phone,
      password: hashedPassword,
      name,
      lastName,
    });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, phone: newUser.phone },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    res.json({ message: "User registered successfully", user: newUser, token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// فراموشی رمز عبور
router.post("/forgot-password", async (req, res) => {
  try {
    const { phone } = req.body;
    const check = canRequestCode(`forgot-${phone}`);
    if (!check.allowed) {
      return res
        .status(429)
        .json({ error: `لطفا ${check.minutesLeft} دقیقه دیگر تلاش کنید.` });
    }

    const user = await User.findOne({ phone });
    if (!user)
      return res.status(404).json({ error: "کاربر با این شماره وجود ندارد" });

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    await Verification.findOneAndUpdate(
      { phone },
      { code, codeExpires: expires },
      { upsert: true, new: true }
    );

    const smsRes = await sendSMSCode(phone, code);
    res.json({ message: "کد ارسال شد ✅", smsRes });
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// ریست رمز عبور
router.post("/reset-password", async (req, res) => {
  try {
    const { phone, code, newPassword } = req.body;
    const record = await Verification.findOne({ phone });
    if (!record) return res.status(404).json({ error: "کد پیدا نشد" });

    if (record.code !== code)
      return res.status(400).json({ error: "کد وارد شده اشتباه است" });
    if (record.codeExpires < new Date())
      return res.status(400).json({ error: "کد منقضی شده است" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ phone }, { password: hashedPassword });
    await Verification.deleteOne({ phone });

    const user = await User.findOne({ phone });
    const token = jwt.sign({ id: user._id, phone: user.phone }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({ message: "رمز عبور با موفقیت تغییر یافت", token });
  } catch (err) {
    res.status(500).json({ error: "خطای سرور" });
  }
});

// ==========================
// آپدیت مشخصات کاربر
// ==========================
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { name, lastName, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { name, lastName, email },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User updated", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================
// تغییر رمز کاربر لاگین شده
// ==========================
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { prevPass, newPass } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "کاربر پیدا نشد" });

    const isMatch = await bcrypt.compare(prevPass, user.password);
    if (!isMatch) return res.status(400).json({ error: "رمز فعلی اشتباه است" });

    const hashed = await bcrypt.hash(newPass, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "رمز عبور با موفقیت تغییر یافت ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطای سرور" });
  }
});

// ==========================
// ذخیره یا بروزرسانی آدرس کاربر
// ==========================
router.post("/address", authMiddleware, async (req, res) => {
  try {
    const { title, description, extraDesc, lat, lng, googleUrl, neshanUrl } =
      req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        address: {
          title,
          description,
          extraDesc,
          lat,
          lng,
          googleUrl,
          neshanUrl,
        },
      },
      { new: true }
    );
    if (!updatedUser)
      return res.status(404).json({ error: "کاربر پیدا نشد ❌" });

    res.json({
      message: "آدرس با موفقیت ذخیره شد ✅",
      address: updatedUser.address,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطای سرور" });
  }
});

router.delete("/address", authMiddleware, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $unset: { address: "" } },
      { new: true }
    );
    if (!updatedUser)
      return res.status(404).json({ message: "کاربر پیدا نشد ❌" });

    res.json({ message: "آدرس با موفقیت حذف شد ✅", user: updatedUser });
  } catch (error) {
    console.error("خطا در حذف آدرس:", error);
    res.status(500).json({ message: "خطا در حذف آدرس از دیتابیس ❌" });
  }
});

export default router;
