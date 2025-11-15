import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// مسیر مقصد آپلود
const __dirname = path.resolve();
const uploadDir = path.join(__dirname, "images");

// اگه پوشه وجود نداشت، بسازش
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// تنظیم Multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 📤 مسیر آپلود
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "هیچ فایلی ارسال نشده!" });
  }

  // مسیر نسبی برای ذخیره در دیتابیس
  const filePath = `/images/${req.file.filename}`;
  res.json({ filePath });
});

export default router;
