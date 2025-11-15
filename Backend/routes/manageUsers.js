import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const router = express.Router();

// 📍 دریافت همه کاربران
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در دریافت کاربران" });
  }
});

// 📍 ویرایش اطلاعات کاربر
router.put("/:id", async (req, res) => {
  try {
    const { name, lastName, phone, password, address } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });

    user.name = name;
    user.lastName = lastName;
    user.phone = phone;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    user.address = address;
    await user.save();

    res.json({ message: "کاربر ویرایش شد", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در ویرایش کاربر" });
  }
});

// 📍 حذف کاربر
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "کاربر یافت نشد" });

    res.json({ message: "کاربر حذف شد" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در حذف کاربر" });
  }
});

export default router;
