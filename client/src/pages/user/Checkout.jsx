
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

import { checkoutFields } from "../../constants";

import {
  FiMapPin,
  FiCreditCard,
  FiShoppingBag,
  FiMinus,
  FiPlus,
  FiTrash2,
  FiEdit2,
} from "react-icons/fi";

import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from "../../services/cart/cartApi";

import {
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
} from "../../services/payment/paymentApi";

import { useCreateOrderMutation } from "../../services/order/orderApi";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [addressSaved, setAddressSaved] = useState(false);
  const [shippingData, setShippingData] = useState(null);

  const { data, isLoading } = useGetCartQuery();

  // const items = data?.cart?.items || [];
  // const subtotal = data?.cart?.totalAmount || 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      country: "India",
    },
  });

  const [createOrder] = useCreateOrderMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();


  /* ==========================
      buynow Data
  ========================== */

  const buyNowData = location.state;

  const isBuyNow = buyNowData?.buyNow;

  const [buyNowQuantity, setBuyNowQuantity] = useState(
    buyNowData?.quantity || 1,
  );
  
const buyNowItems = isBuyNow
  ? [
      {
        product: buyNowData.product,
        quantity: buyNowQuantity,
        price:
          buyNowData.product.discountPrice > 0
            ? buyNowData.product.discountPrice
            : buyNowData.product.price,
      },
    ]
  : [];

  const items = isBuyNow ? buyNowItems : data?.cart?.items || [];

  const subtotal = isBuyNow
    ? buyNowItems.reduce((total, item) => total + item.price * item.quantity, 0)
    : data?.cart?.totalAmount || 0;


  /* ==========================
        Cart
  ========================== */

  const handleQuantity = async (productId, currentQty, change) => {
    const newQty = currentQty + change;

    if (newQty < 1) return;

    try {
      await updateCartItem({
        productId,
        quantity: newQty,
      }).unwrap();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update cart");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeCartItem(productId).unwrap();

      toast.success("Removed from cart");
    } catch (error) {
      toast.error(error?.data?.message || "Failed");
    }
  };

  /* ==========================
      Load Razorpay
  ========================== */

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  /* ==========================
      Save Address
  ========================== */

  const handleCheckout = (formData) => {
    if (!items.length) {
      return toast.error("Cart is empty");
    }

    setShippingData(formData);
    setAddressSaved(true);
  };

  /* ==========================
      Payment
  ========================== */

  const handlePayment = async () => {
    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        return toast.error("Failed to load Razorpay");
      }

    const orderRes = await createOrder({
      shippingAddress: shippingData,
      paymentMethod: "RAZORPAY",
      buyNowItems: isBuyNow
        ? [
            {
              product: buyNowData.product._id,
              quantity: buyNowQuantity,
            },
          ]
        : undefined,
    }).unwrap();

      const payment = await createRazorpayOrder({
        orderId: orderRes.order._id,
      }).unwrap();

      const options = {
        key: payment.key,

        amount: payment.amount,

        currency: payment.currency,

        order_id: payment.razorpayOrderId,

        name: "ShopSphere",

        description: "Secure Payment",

        handler: async (response) => {
          try {
            await verifyPayment({
              orderId: payment.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            toast.success("Payment Successful 🎉");

            navigate("/orders");
          } catch (error) {
            toast.error(
              error?.data?.message || "Payment verification failed"
            );
          }
        },

        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
          },
        },

        theme: {
          color: "#111827",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      toast.error(error?.data?.message || "Checkout failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="animate-pulse text-lg font-medium text-gray-500">
          Loading Checkout...
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-[90%]">
        {/* Header */}

        <div className="mb-10 flex items-center gap-4">
          <div className="rounded-2xl bg-black p-4 text-white">
            <FiShoppingBag size={28} />
          </div>

          <div>
            <h1 className="text-4xl font-bold">Checkout</h1>

            <p className="mt-2 text-gray-500">
              Complete your shipping details and securely place your order.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* ================= Left ================= */}

          {addressSaved ? (
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-black p-3 text-white">
                    <FiMapPin size={22} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">Shipping Address</h2>

                    <p className="text-sm text-gray-500">
                      Review your delivery address
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAddressSaved(false)}
                  className="flex items-center gap-2 border-gray-300 rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
                >
                  <FiEdit2 />
                  Edit Address
                </button>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <h3 className="text-lg font-semibold">
                  {shippingData.fullName}
                </h3>

                <p className="mt-2">{shippingData.phone}</p>

                <p className="mt-4">{shippingData.address}</p>

                {shippingData.landmark && <p>{shippingData.landmark}</p>}

                <p className="mt-2">
                  {shippingData.city}, {shippingData.state}
                </p>

                <p>
                  {shippingData.country} - {shippingData.postalCode}
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(handleCheckout)}
              className="rounded-3xl bg-white p-8 shadow-sm"
            >
              <div className="mb-8 flex items-center gap-3">
                <div className="rounded-xl bg-black p-3 text-white">
                  <FiMapPin size={22} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">Shipping Address</h2>

                  <p className="text-sm text-gray-500">
                    We'll deliver your order here.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {checkoutFields.map((field) => {
                  const validation = {};

                  if (field.required) {
                    validation.required = field.required;
                  }

                  if (field.minLength) {
                    validation.minLength = field.minLength;
                  }

                  return (
                    <div
                      key={field.name}
                      className={field.colSpan === 2 ? "md:col-span-2" : ""}
                    >
                      {field.component === "textarea" ? (
                        <textarea
                          rows={field.rows}
                          placeholder={field.placeholder}
                          {...register(field.name, validation)}
                          className="w-full rounded-xl border border-gray-400 px-4 py-3 outline-none transition focus:border-black"
                        />
                      ) : (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          {...register(field.name, validation)}
                          className="w-full rounded-xl border border-gray-400 px-4 py-3 outline-none transition focus:border-black"
                        />
                      )}

                      {errors[field.name] && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[field.name].message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="submit"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-gray-800"
              >
                <FiCreditCard />
                Continue
              </button>
            </form>
          )}

          {/* ================= Right ================= */}

          <div className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-black p-3 text-white">
                <FiShoppingBag size={20} />
              </div>

              <div>
                <h2 className="text-2xl font-bold">Order Summary</h2>

                <p className="text-sm text-gray-500">
                  {items.length} Item
                  {items.length !== 1 && "s"}
                </p>
              </div>
            </div>

            <div className="max-h-[420px] space-y-4 overflow-y-auto pr-2">
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center gap-4 rounded-2xl border-gray-300 border p-3"
                >
                  <img
                    src={
                      item.product.images?.length
                        ? item.product.images[0].url
                        : "https://placehold.co/80"
                    }
                    alt={item.product.title}
                    className="h-20 w-20 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="line-clamp-2 font-semibold">
                      {item.product.title}
                    </h3>

                    <div className="mt-3 flex items-center justify-between">
                      {isBuyNow ? (
                        <div className="flex items-center rounded-xl border-gray-300 border bg-gray-50">
                          <button
                            type="button"
                            onClick={() =>
                              setBuyNowQuantity((prev) => Math.max(1, prev - 1))
                            }
                            className="flex h-9 w-9 items-center rounded-l-xl justify-center hover:bg-white"
                          >
                            <FiMinus size={14} />
                          </button>

                          <span className="w-8 text-center font-semibold">
                            {buyNowQuantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setBuyNowQuantity((prev) =>
                                Math.min(item.product.stock, prev + 1),
                              )
                            }
                            className="flex h-9 w-9 rounded-r-xl items-center justify-center hover:bg-white"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center border-gray-300 rounded-xl border bg-gray-50">
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantity(
                                  item.product._id,
                                  item.quantity,
                                  -1,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center hover:bg-white"
                            >
                              <FiMinus size={14} />
                            </button>

                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleQuantity(
                                  item.product._id,
                                  item.quantity,
                                  1,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center hover:bg-white"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemove(item.product._id)}
                            className="text-red-500 transition hover:text-red-600"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>

                    <p className="text-xs text-gray-500">
                      ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-gray-300 border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>

                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>

                <span className="font-medium text-green-600">FREE</span>
              </div>

              <div className="flex justify-between border-gray-300 border-t pt-4 text-xl font-bold">
                <span>Total</span>

                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {addressSaved && (
              <button
                type="button"
                onClick={handlePayment}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-gray-800"
              >
                <FiCreditCard />
                Pay ₹{subtotal.toLocaleString("en-IN")}
              </button>
            )}

            <div className="mt-6 rounded-2xl bg-green-50 p-4 text-sm text-green-700">
              ✅ Secure payment powered by Razorpay
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;

    