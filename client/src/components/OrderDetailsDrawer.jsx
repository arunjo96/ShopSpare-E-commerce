
import { useEffect } from "react";
import {
  FiX,
  FiUser,
  FiMapPin,
  FiShoppingBag,
  FiCreditCard,
} from "react-icons/fi";

const OrderDetailsDrawer = ({ open, order, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open || !order) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      {/* Modal */}

      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Order Details
            </p>

            <h2 className="mt-1 text-sm sm:text-xl font-bold text-slate-900">
              #{order._id}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {/* Customer & Shipping */}

          <div className="grid gap-4 md:grid-cols-2">
            {/* Customer */}

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
                  <FiUser size={18} />
                </div>

                <h3 className="text-base font-semibold text-slate-900">
                  Customer Details
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-sm text-gray-500">Name</span>

                  <span className="text-sm font-semibold text-slate-900">
                    {order.user?.name}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-sm text-gray-500">Email</span>

                  <span className="text-sm font-medium text-slate-900">
                    {order.user?.email}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-sm text-gray-500">Payment</span>

                  <span className="text-sm font-medium text-slate-900">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Payment Status</span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping */}

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <FiMapPin size={18} />
                </div>

                <h3 className="text-base font-semibold text-slate-900">
                  Shipping Address
                </h3>
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <p className="font-semibold text-slate-900">
                  {order.shippingAddress?.fullName}
                </p>

                <p>{order.shippingAddress?.phone}</p>

                <p>{order.shippingAddress?.addressLine1}</p>

                {order.shippingAddress?.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}

                {order.shippingAddress?.landmark && (
                  <p>{order.shippingAddress.landmark}</p>
                )}

                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>

                <p>{order.shippingAddress?.postalCode}</p>

                <p className="font-medium text-slate-900">
                  {order.shippingAddress?.country}
                </p>
              </div>
            </div>
          </div>

          {/* Ordered Products */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                  <FiShoppingBag size={18} />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Ordered Products
                  </h3>

                  <p className="text-sm text-gray-500">
                    {order.orderItems?.length} Item
                    {order.orderItems?.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="max-h-72 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 z-10 bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                        Product
                      </th>

                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">
                        Qty
                      </th>

                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600">
                        Price
                      </th>

                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {order.orderItems?.map((item) => (
                      <tr
                        key={item.product}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-12 w-12 rounded-lg border object-cover"
                            />

                            <div className="min-w-0">
                              <h4 className="truncate font-medium capitalize text-slate-900">
                                {item.title}
                              </h4>

                              <p className="text-xs text-gray-500">
                                Product Item
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold">
                            {item.quantity}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right text-sm font-medium text-slate-700">
                          ₹{item.price.toLocaleString("en-IN")}
                        </td>

                        <td className="px-4 py-3 text-right font-semibold text-slate-900">
                          ₹{item.totalPrice.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Summary & Status */}

          <div className="grid gap-4 md:grid-cols-2">
            {/* Price Summary */}

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <FiCreditCard size={18} />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Price Summary
                  </h3>

                  <p className="text-sm text-gray-500">Payment breakdown</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Items Price</span>

                  <span className="font-medium text-slate-900">
                    ₹{order.itemsPrice?.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Shipping</span>

                  <span className="font-medium text-slate-900">
                    ₹{order.shippingPrice?.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Tax</span>

                  <span className="font-medium text-slate-900">
                    ₹{order.taxPrice?.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-slate-900">
                      Grand Total
                    </span>

                    <span className="text-xl font-bold text-slate-900">
                      ₹{order.totalPrice?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status */}

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-base font-semibold text-slate-900">
                Order Status
              </h3>

              <p className="mb-5 text-sm text-gray-500">
                Current order information
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span className="text-sm text-gray-600">Order Status</span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.orderStatus === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : order.orderStatus === "Shipped"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span className="text-sm text-gray-600">Payment Status</span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span className="text-sm text-gray-600">Payment Method</span>

                  <span className="text-sm font-semibold text-slate-900">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsDrawer;