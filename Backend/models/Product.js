import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true }, // فقط نام دسته به صورت رشته
  available: { type: Boolean, default: true },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
