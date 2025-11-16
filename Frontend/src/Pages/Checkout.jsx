import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Css/Checkout.css";
import axios from "axios";
import NoAddressImg from "/images/NoAddress.jpg";
import Toast from "../Components/Toast.jsx";
import Seo from "../Components/Seo.jsx";

export default function Checkout() {
  const [cart, setCart] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [products, setProducts] = useState([]);
  const [isPaying, setIsPaying] = useState(false);
  const [toast, setToast] = useState(null);
  const [isPickup, setIsPickup] = useState(false); // ✅ تحویل حضوری
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setToast({
        type: "error",
        message: "برای مشاهده صفحه پرداخت باید وارد شوید.",
        onClose: () => navigate("/login"),
      });
      return;
    }

    const savedCart = JSON.parse(localStorage.getItem("cart")) || {};
    const cleanedCart = Object.fromEntries(
      Object.entries(savedCart).filter(([_, qty]) => Number(qty) > 0)
    );
    setCart(cleanedCart);
    localStorage.setItem("cart", JSON.stringify(cleanedCart));

    let savedAddresses = JSON.parse(localStorage.getItem("userAddress"));
    if (!savedAddresses) savedAddresses = [];
    else if (!Array.isArray(savedAddresses)) savedAddresses = [savedAddresses];
    setAddresses(savedAddresses);

    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch(() =>
        setToast({
          type: "error",
          message: "خطا در دریافت محصولات از سرور",
          onClose: () => setToast(null),
        })
      );
  }, [navigate]);

  const addBtn = (id) => {
    const updatedCart = { ...cart, [id]: (cart[id] || 0) + 1 };
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const subBtn = (id) => {
    if (!cart[id]) return;
    const updatedCart = { ...cart };
    if (updatedCart[id] > 1) updatedCart[id] -= 1;
    else delete updatedCart[id];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const product = products.find((p) => p._id === id);
      if (!product) return null;
      return { ...product, quantity: Number(qty) };
    })
    .filter((item) => item && item.quantity > 0);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleAddAddress = () => navigate("/user/add-address");
  const handleEditAddress = () => navigate("/user/addresses");

  const handleFakePayment = async () => {
    setIsPaying(true);

    setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id;

        if (!userId) {
          setToast({
            type: "error",
            message: "کاربر شناسایی نشد. لطفاً دوباره وارد شوید.",
            onClose: () => navigate("/login"),
          });
          return;
        }

        // ✅ تعیین آدرس بر اساس نوع تحویل
        let addressData = null;
        if (isPickup) {
          addressData = {
            title: "تحویل حضوری",
            description: "تحویل حضوری از فروشگاه",
            neshanUrl: "",
            googleUrl: "",
          };
        } else {
          const address = JSON.parse(localStorage.getItem("userAddress"));
          if (!address) {
            setToast({
              type: "warning",
              message: "هیچ آدرسی یافت نشد!",
              onClose: () => setToast(null),
            });
            return;
          }
          addressData = {
            title: address.title,
            description: address.extraDesc
              ? `${address.description}، ${address.extraDesc}`
              : address.description,
            neshanUrl: address.neshanUrl,
            googleUrl: address.googleUrl,
          };
        }

        const userInfo = {
          fullName: `${user.name} ${user.lastName}`,
          phoneNumber: user.phone,
        };

        const cartItemsData = cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }));

        const orderData = {
          userId,
          cartItems: cartItemsData,
          address: addressData,
          totalPrice,
          userInfo,
          deliveryType: isPickup ? "pickup" : "delivery",
          createdAt: new Date().toISOString(),
        };

        await axios.post("http://localhost:5000/api/orders", orderData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const localOrders = JSON.parse(localStorage.getItem("orders")) || [];
        localOrders.push(orderData);
        localStorage.setItem("orders", JSON.stringify(localOrders));

        localStorage.removeItem("cart");
        setToast({
          type: "success",
          message: "پرداخت با موفقیت انجام شد و سفارش ثبت گردید ",
          onClose: () => navigate("/user/orders"),
        });
      } catch (err) {
        console.error("خطا در ثبت سفارش:", err);
        setToast({
          type: "error",
          message: "خطایی در ثبت سفارش رخ داد. لطفاً مجدداً تلاش کنید.",
          onClose: () => setToast(null),
        });
      } finally {
        setIsPaying(false);
      }
    }, 3000);
  };

  const handleSubmitOrder = () => {
    if (cartItems.length === 0) {
      setToast({
        type: "warning",
        message: "سبد خرید شما خالی است!",
        onClose: () => setToast(null),
      });
      return;
    }

    // ✅ بررسی حالت تحویل حضوری یا آدرس
    if (!isPickup && addresses.length === 0) {
      setToast({
        type: "warning",
        message: "آدرسی وارد نکرده‌اید و تحویل حضوری انتخاب نشده است!",
        onClose: () => setToast(null),
      });
      return;
    }

    setToast({
      type: "confirm",
      message: `آیا مایل به پرداخت مبلغ ${totalPrice.toLocaleString()} تومان هستید؟`,
      onConfirm: handleFakePayment,
      onClose: () => setToast(null),
    });
  };

  return (
    <>
      <Seo
        title="تکمیل سفارش | کافه جلاتو"
        description="مشاهده سبد خرید و ثبت نهایی سفارش‌ها در کافه جلاتو"
        url="https://gelatocafe.ir/checkout"
      />
      <section className="checkout">
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={toast.onClose}
            onConfirm={toast.onConfirm}
          />
        )}

        <div className="checkout-cart">
          <div className="title">
            <span className="material-symbols-outlined">check_circle</span>
            <h2>تکمیل سفارش</h2>
          </div>

          {cartItems.length === 0 ? (
            <p>سبد خرید خالی است.</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li key={item._id}>
                  <div className="left">
                    <button id="add" onClick={() => addBtn(item._id)}>
                      <span className="material-symbols-outlined">
                        add_circle
                      </span>
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => subBtn(item._id)}>
                      <span className="material-symbols-outlined">
                        do_not_disturb_on
                      </span>
                    </button>
                  </div>

                  <div className="right">
                    <p>{item.name}</p>
                    <span>{item.price.toLocaleString()} تومان</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="price">
            <p>{totalPrice.toLocaleString()} تومان</p>
            <p className="total">مبلغ قابل پرداخت</p>
          </div>

          {/* ✅ گزینه تحویل حضوری */}
          <div className="pickup-option">
            <label>
              <input
                type="checkbox"
                checked={isPickup}
                onChange={(e) => setIsPickup(e.target.checked)}
              />
              تحویل حضوری از فروشگاه
            </label>
          </div>

          <div className="checkout-submit">
            <p>زمان ارسال سفارش ۴۰ دقیقه می‌باشد</p>
            <button
              onClick={handleSubmitOrder}
              disabled={isPaying || cartItems.length === 0}
            >
              {isPaying ? "در حال پرداخت..." : "ثبت نهایی سفارش"}
            </button>
          </div>
        </div>

        {/* ✅ نمایش آدرس فقط وقتی تحویل حضوری فعال نیست */}
        {!isPickup && (
          <div className="checkout-address">
            <div
              className="title"
              style={
                addresses.length === 0
                  ? { justifyContent: "space-between" }
                  : {}
              }
            >
              {addresses.length === 0 ? (
                <button type="button" onClick={handleAddAddress}>
                  افزودن آدرس
                </button>
              ) : null}
              <div>
                <span className="material-symbols-outlined">location_on</span>
                <h2>آدرس تحویل</h2>
              </div>
            </div>

            {addresses.length === 0 ? (
              <div className="no-address">
                <img src={NoAddressImg} alt="No Address" />
                <h3>آدرسی ثبت نشده است</h3>
              </div>
            ) : (
              <ul className="address-list">
                {addresses.map((address, index) => (
                  <li key={index}>
                    <div className="map">
                      <iframe
                        title={`map-${index}`}
                        src={`https://neshan.org/maps/iframe/places/_bv5-jPxL2FP#c35.839-50.995-18z-0p/${address.lat}/${address.lng}`}
                        width="350"
                        height="230"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                    </div>
                    <div className="bottom">
                      <div>
                        <h3>{address.title}</h3>
                        <p>{address.description}</p>
                        {address.extraDesc && <p>{address.extraDesc}</p>}
                      </div>
                      <div className="actions">
                        <button type="button" onClick={handleEditAddress}>
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                          <p>ویرایش</p>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </>
  );
}
