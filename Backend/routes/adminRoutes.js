import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/user.js";
import Order from "../models/order.js";

const router = express.Router();

// Middleware برای بررسی توکن JWT
function verifyToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "توکن وجود ندارد" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "توکن نامعتبر است" });
  }
}

// ✅ لاگین ادمین
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "نام کاربری یا رمز اشتباه است" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "نام کاربری یا رمز اشتباه است" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "ورود موفق", token });
  } catch (err) {
    res.status(500).json({ message: "خطای سرور", error: err.message });
  }
});

// ✅ آمار کاربران و سفارش‌ها
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const today = new Date();

    // 🔹 سفارش و درآمد روزانه ۷ روز اخیر
    const dailyOrders = [];
    const dailyRevenue = [];
    const dailyLabels = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      day.setHours(0, 0, 0, 0);

      const dayStart = new Date(day);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      const orders = await Order.find({
        createdAt: { $gte: dayStart, $lte: dayEnd },
      });

      // تعداد سفارش
      dailyOrders.push(orders.length);

      // درآمد روزانه
      const revenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      dailyRevenue.push(revenue);

      // برچسب روز
      const options = { weekday: "long" };
      dailyLabels.push(day.toLocaleDateString("fa-IR", options));
    }

    // 🔹 سفارش و درآمد ماهانه ۱۲ ماه اخیر
    const monthlyOrders = [];
    const monthlyRevenue = [];
    const monthlyLabels = [];

    for (let m = 0; m < 12; m++) {
      const monthStart = new Date(today.getFullYear(), m, 1);
      const monthEnd = new Date(today.getFullYear(), m + 1, 0, 23, 59, 59, 999);

      const orders = await Order.find({
        createdAt: { $gte: monthStart, $lte: monthEnd },
      });

      monthlyOrders.push(orders.length);

      const revenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      monthlyRevenue.push(revenue);

      const monthLabel = monthStart.toLocaleDateString("fa-IR", {
        month: "long",
      });
      monthlyLabels.push(monthLabel);
    }

    res.json({
      usersCount,
      dailyOrders,
      dailyRevenue,
      dailyLabels,
      monthlyOrders,
      monthlyRevenue,
      monthlyLabels,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطای سرور", error: err.message });
  }
});

export default router;
