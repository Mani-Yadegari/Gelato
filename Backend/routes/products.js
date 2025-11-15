import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// دریافت همه محصولات
router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // میتونه همه فیلدها رو برگردونه
    res.json(products); // خروجی JSON مشابه چیزی که فرستادی
  } catch (err) {
    res.status(500).json({ error: "خطا در دریافت محصولات" });
  }
});

export default router;
