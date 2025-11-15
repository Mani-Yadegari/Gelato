import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  address: {
    title: String,
    description: String,
    neshanUrl: String, // لینک iframe نشان
    googleUrl: String, // لینک گوگل
  },
  userInfo: {
    // ✅ اضافه شد
    fullName: String,
    phoneNumber: String,
  },
  totalPrice: Number,
  status: {
    type: String,
    enum: ["در حال پردازش", "ارسال شد", "تکمیل شد", "لغو شد"],
    default: "در حال پردازش",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
