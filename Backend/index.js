import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/manageProductsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import manageUsersRoutes from "./routes/manageUsers.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import path from "path";
import multer from "multer";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ مسیر دسترسی به پوشه public
const __dirname = path.resolve();
app.use("/images", express.static(path.join(__dirname, "images")));

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manage-products", productRoutes);
app.use("/api/manage-users", manageUsersRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
