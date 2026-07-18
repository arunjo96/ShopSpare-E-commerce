import { FiX } from "react-icons/fi";

const OrderDetailsDrawer = ({ open, order, onClose }) => {
  if (!order) return null;

  return (
    <>
      {/* Overlay */}

      {open && (
        <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40" />
      )}

      {/* Drawer */}

      <div
        className={`fixed right-0 top-0 z-50 h-screen w-full max-w-2xl overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}

        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5">
          <div>
            <h2 className="text-2xl font-bold">Order Details</h2>

            <p className="text-sm text-gray-500">#{order._id}</p>
          </div>

          <button onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-8 p-6">
          {/* Customer */}

          <div>
            <h3 className="mb-3 text-lg font-semibold">Customer Details</h3>

            <div className="space-y-2 rounded-lg border p-4">
              <p>
                <strong>Name :</strong> {order.user?.name}
              </p>

              <p>
                <strong>Email :</strong> {order.user?.email}
              </p>

              <p>
                <strong>Payment :</strong> {order.paymentMethod}
              </p>

              <p>
                <strong>Payment Status :</strong>{" "}
                <span
                  className={`font-semibold ${
                    order.paymentStatus === "Paid"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </p>
            </div>
          </div>

          {/* Shipping */}

          <div>
            <h3 className="mb-3 text-lg font-semibold">Shipping Address</h3>

            <div className="space-y-2 rounded-lg border p-4">
              <p>{order.shippingAddress?.fullName}</p>

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

              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Products */}

          <div>
            <h3 className="mb-3 text-lg font-semibold">Ordered Products</h3>

            <div className="space-y-4">
              {order.orderItems?.map((item) => (
                <div
                  key={item.product}
                  className="flex gap-4 rounded-lg border p-3"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-20 w-20 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h4 className="font-semibold">{item.title}</h4>

                    <p className="text-sm text-gray-500">
                      Qty : {item.quantity}
                    </p>

                    <p className="mt-1 font-semibold text-green-600">
                      ₹{item.price}
                    </p>
                  </div>

                  <div className="font-bold">₹{item.totalPrice}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}

          <div>
            <h3 className="mb-3 text-lg font-semibold">Price Summary</h3>

            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex justify-between">
                <span>Items Price</span>

                <span>₹{order.itemsPrice}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>

                <span>₹{order.shippingPrice}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>

                <span>₹{order.taxPrice}</span>
              </div>

              <div className="flex justify-between border-t pt-3 text-lg font-bold">
                <span>Total</span>

                <span>₹{order.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Status */}

          <div>
            <h3 className="mb-3 text-lg font-semibold">Order Status</h3>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                order.orderStatus === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : order.orderStatus === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.orderStatus}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsDrawer;
