import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Css/ManageProducts.css";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    newImage: null,
    available: true,
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    newCategory: "",
    image: null,
  });

  const newFileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://gelatocafe.ir/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("❌ خطا در دریافت محصولات:", err);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setEditForm({
      name: p.name,
      price: p.price,
      description: p.description,
      category: p.category,
      newImage: null,
      available: p.available ?? true,
    });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("price", editForm.price);
      formData.append("category", editForm.category);
      formData.append("description", editForm.description);
      formData.append("available", editForm.available);
      if (editForm.newImage) formData.append("image", editForm.newImage);

      await axios.put(
        `https://gelatocafe.ir/api/manage-products/${editingId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setEditingId(null);
      setEditForm({
        name: "",
        price: "",
        description: "",
        category: "",
        newImage: null,
        available: true,
      });
      if (editFileInputRef.current) editFileInputRef.current.value = "";
      fetchProducts();
    } catch (err) {
      console.error("❌ خطا در ویرایش محصول:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("آیا از حذف این محصول مطمئنی؟")) {
      try {
        await axios.delete(`https://gelatocafe.ir/api/manage-products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error("❌ خطا در حذف محصول:", err);
      }
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);

      const categoryToSend =
        newProduct.category === "__new"
          ? newProduct.newCategory
          : newProduct.category;
      formData.append("category", categoryToSend);

      formData.append("description", newProduct.description);
      if (newProduct.image) formData.append("image", newProduct.image);

      await axios.post("https://gelatocafe.ir/api/manage-products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewProduct({
        name: "",
        price: "",
        description: "",
        category: "",
        newCategory: "",
        image: null,
      });
      if (newFileInputRef.current) newFileInputRef.current.value = "";
      fetchProducts();
    } catch (err) {
      console.error("❌ خطا در افزودن محصول:", err);
    }
  };

  // دسته‌بندی‌های موجود برای select
  const categoriesList = Array.from(new Set(products.map((p) => p.category)));

  return (
    <section className="admin-products-sec">
      <div className="products-content">
        <div className="products-title">
          <h3>مدیریت محصولات</h3>
          <span className="material-symbols-outlined">inventory_2</span>
        </div>

        {/* فرم افزودن محصول جدید */}
        <form className="add-product-form" onSubmit={handleAddProduct}>
          <h4>➕ افزودن محصول جدید</h4>
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            placeholder="نام محصول"
            required
          />
          <input
            type="text"
            value={
              newProduct.price
                ? newProduct.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ""
            }
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              if (/^\d*$/.test(rawValue))
                setNewProduct({ ...newProduct, price: rawValue });
            }}
            placeholder="قیمت (تومان)"
            required
          />

          {/* select دسته‌بندی */}
          <select
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
          >
            <option value="">انتخاب دسته‌بندی</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="__new">➕ دسته‌بندی جدید</option>
          </select>

          {/* input دسته‌بندی جدید */}
          {newProduct.category === "__new" && (
            <input
              type="text"
              placeholder="نام دسته‌بندی جدید"
              value={newProduct.newCategory || ""}
              onChange={(e) =>
                setNewProduct({ ...newProduct, newCategory: e.target.value })
              }
              required
            />
          )}

          <textarea
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            placeholder="توضیحات..."
          />
          <input
            type="file"
            accept="image/*"
            ref={newFileInputRef}
            onChange={(e) =>
              setNewProduct({ ...newProduct, image: e.target.files[0] })
            }
          />
          <button type="submit" className="add-btn">
            افزودن محصول ✅
          </button>
        </form>

        {/* لیست محصولات */}
        {products.length > 0 ? (
          <ul className="products-list">
            {products
              .sort((a, b) =>
                a.available === b.available ? 0 : a.available ? -1 : 1
              ) // ناموجودها آخر
              .map((p) => (
                <li key={p._id}>
                  <div className="product-row">
                    <img
                      src={`https://gelatocafe.ir${p.image}?t=${Date.now()}`}
                      alt={p.name}
                      className="product-img"
                    />

                    {editingId === p._id ? (
                      <div className="product-info">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          placeholder="نام محصول"
                        />
                        <input
                          type="number"
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm({ ...editForm, price: e.target.value })
                          }
                          placeholder="قیمت (تومان)"
                        />
                        <input
                          type="text"
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              category: e.target.value,
                            })
                          }
                          placeholder="دسته‌بندی"
                        />
                        <textarea
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                          }
                          placeholder="توضیحات..."
                        />

                        <div className="availability-toggle">
                          <label>
                            <input
                              type="checkbox"
                              checked={editForm.available}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  available: e.target.checked,
                                })
                              }
                            />
                            <span>
                              {editForm.available ? "موجود ✅" : "ناموجود ❌"}
                            </span>
                          </label>
                        </div>

                        <input
                          type="file"
                          accept="image/*"
                          ref={editFileInputRef}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              newImage: e.target.files[0],
                            })
                          }
                        />
                      </div>
                    ) : (
                      <div className="product-info">
                        <div>
                          <span className="label">نام:</span>
                          <span>{p.name}</span>
                        </div>
                        <div>
                          <span className="label">قیمت:</span>
                          <span>{p.price.toLocaleString()} تومان</span>
                        </div>
                        <div>
                          <span className="label">دسته:</span>
                          <span>{p.category}</span>
                        </div>
                        <div>
                          <span className="label">وضعیت:</span>
                          <span>{p.available ? "موجود ✅" : "ناموجود ❌"}</span>
                        </div>
                        <span className="desc">{p.description}</span>
                      </div>
                    )}

                    <div className="product-actions">
                      {editingId === p._id ? (
                        <>
                          <button className="save-btn" onClick={handleSave}>
                            💾 ذخیره
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() => {
                              setEditingId(null);
                              setEditForm({
                                name: "",
                                price: "",
                                description: "",
                                category: "",
                                newImage: null,
                                available: true,
                              });
                              if (editFileInputRef.current)
                                editFileInputRef.current.value = "";
                            }}
                          >
                            ❌ انصراف
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(p)}
                          >
                            ✏️ ویرایش
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(p._id)}
                          >
                            🗑 حذف
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <div className="empty">هیچ محصولی ثبت نشده است.</div>
        )}
      </div>
    </section>
  );
}
