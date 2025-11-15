import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import Product from "../models/Product.js";
import { fileURLToPath } from "url";

const router = express.Router();

// ⚡ مسیر دقیق ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// مسیر ذخیره عکس‌ها
const uploadDir = path.join(__dirname, "../images");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer: ذخیره امن عکس‌ها با نام یکتا
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName =
      Date.now() + "-" + crypto.randomBytes(6).toString("hex") + ext;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// 📦 دریافت همه محصولات
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در دریافت محصولات" });
  }
});

// ➕ افزودن محصول جدید
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    if (!req.file) return res.status(400).json({ message: "عکس الزامی است" });

    const imagePath = `/images/${req.file.filename}`;
    const newProduct = new Product({
      name,
      price,
      description,
      category,
      image: imagePath,
      available: true, // ✅ به‌صورت پیش‌فرض موجود است
    });

    await newProduct.save();
    res.status(201).json({ message: "محصول اضافه شد", newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در افزودن محصول" });
  }
});

// ✏️ ویرایش محصول (به‌روزرسانی جزئی + جایگزینی عکس در صورت ارسال)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category, available } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "محصول یافت نشد" });

    // به‌روزرسانی مقادیر
    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (category) product.category = category;

    // ✅ وضعیت موجود / ناموجود
    if (available !== undefined) {
      product.available = available === "true" || available === true;
    }

    // اگر عکس جدید ارسال شد
    if (req.file) {
      const oldImage = path.join(
        __dirname,
        "../images",
        path.basename(product.image)
      );
      if (fs.existsSync(oldImage)) fs.unlinkSync(oldImage);

      product.image = `/images/${req.file.filename}`;
    }

    await product.save();
    res.json({ message: "محصول ویرایش شد", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در ویرایش محصول" });
  }
});

// 🗑 حذف محصول و عکس آن
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "محصول یافت نشد" });

    const imageFile = path.join(
      __dirname,
      "../images",
      path.basename(product.image)
    );
    if (fs.existsSync(imageFile)) fs.unlinkSync(imageFile);

    res.json({ message: "محصول حذف شد" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در حذف محصول" });
  }
});

export default router;
