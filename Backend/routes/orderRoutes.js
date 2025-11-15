import express from "express";
import Order from "../models/order.js";

const router = express.Router();

// 📦 ثبت سفارش جدید
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      address,
      totalPrice,
      status,
      userInfo,
      deliveryType,
    } = req.body;

    // بررسی کامل بودن داده‌ها
    if (!userId || !cartItems || !userInfo) {
      return res.status(400).json({ message: "اطلاعات سفارش ناقص است" });
    }

    // اگر نوع تحویل پستی باشد ولی آدرس نباشد
    if (deliveryType !== "pickup" && !address) {
      return res.status(400).json({ message: "آدرس برای ارسال الزامی است" });
    }

    let addressData = null;
    if (deliveryType !== "pickup") {
      const { title, description, extraDesc, neshanUrl, googleUrl } = address;
      addressData = {
        title,
        description: extraDesc ? `${description}، ${extraDesc}` : description,
        neshanUrl,
        googleUrl,
      };
    }

    const newOrder = new Order({
      userId,
      items: cartItems,
      address: addressData,
      userInfo,
      totalPrice,
      deliveryType: deliveryType || "delivery",
      status: status || "در حال پردازش",
      createdAt: new Date(),
    });

    await newOrder.save();

    console.log(`
====================================
📦 سفارش جدید ثبت شد ✅
👤 مشتری: ${userInfo?.fullName || "نامشخص"}
📞 تلفن: ${userInfo?.phoneNumber || "نامشخص"}
🚚 نوع تحویل: ${deliveryType === "pickup" ? "تحویل حضوری" : "ارسال به آدرس"}
🏠 آدرس: ${newOrder.address?.description || "ندارد"}
💰 مبلغ کل: ${totalPrice?.toLocaleString() || 0} تومان
🕒 زمان ثبت: ${newOrder.createdAt.toLocaleString("fa-IR")}
====================================
`);

    res.status(201).json({
      message: "✅ سفارش با موفقیت ثبت شد",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ خطا در ثبت سفارش:", error);
    res.status(500).json({ message: "خطا در ثبت سفارش", error });
  }
});

// 🧾 دریافت همه سفارش‌ها (برای ادمین)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("❌ خطا در دریافت سفارش‌ها:", error);
    res.status(500).json({ message: "خطا در دریافت سفارش‌ها", error });
  }
});

// 🔍 دریافت سفارش‌ها بر اساس userId
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error("❌ خطا در دریافت سفارش کاربر:", error);
    res.status(500).json({ message: "خطا در دریافت سفارش کاربر", error });
  }
});

// 🛠 به‌روزرسانی وضعیت سفارش
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "سفارش یافت نشد" });
    }

    order.status = status || order.status;
    await order.save();

    res.json({
      message: "✅ وضعیت سفارش با موفقیت به‌روزرسانی شد",
      updatedOrder: order,
    });
  } catch (error) {
    console.error("❌ خطا در آپدیت وضعیت سفارش:", error);
    res.status(500).json({ message: "خطا در آپدیت وضعیت سفارش", error });
  }
});

export default router;
