
import {
  FiX,
  FiMapPin,
  FiCreditCard,
  FiPackage,
  FiTruck,
} from "react-icons/fi";

const OrderDetailsModal = ({ isOpen, onClose, order, onCancel }) => {
  if (!isOpen || !order) return null;

  const canCancel =
    order.orderStatus === "Pending" || order.orderStatus === "Confirmed";

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}

      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          flex
          max-h-[90vh]
          w-[95%]
          max-w-5xl
          -translate-x-1/2
          -translate-y-1/2
          flex-col
          overflow-hidden
          rounded-3xl
          bg-white
          shadow-2xl
        "
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-300 px-8 py-4">
          <div>
            <h2 className="text-2xl font-bold">Order Details</h2>

            <p className="mt-1 text-sm text-gray-500">#{order._id}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto p-8">
          {/* Status */}

          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-blue-50 p-5">
              <p className="text-xs text-gray-500">Order Status</p>

              <p className="mt-2 font-bold text-blue-700">
                {order.orderStatus}
              </p>
            </div>

            <div className="rounded-2xl bg-green-50 p-5">
              <p className="text-xs text-gray-500">Payment</p>

              <p className="mt-2 font-bold text-green-700">
                {order.paymentStatus}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-100 p-5">
              <p className="text-xs text-gray-500">Method</p>

              <p className="mt-2 font-bold">{order.paymentMethod}</p>
            </div>

            <div className="rounded-2xl bg-orange-50 p-5">
              <p className="text-xs text-gray-500">Ordered On</p>

              <p className="mt-2 font-bold">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Products */}

          <div className="mb-10">
            <div className="mb-5 flex items-center gap-2">
              <FiPackage />

              <h3 className="text-lg font-semibold">Ordered Products</h3>
            </div>

            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    p-4
                    border-gray-200
                    shadow-sm
                  "
                >
                  <img
                    src={item.image || "https://placehold.co/100"}
                    alt={item.title}
                    className="h-20 w-20 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <h4 className="font-semibold text-xl capitalize ">
                      {item.title}
                    </h4>

                    <p className="mt-1 text-sm text-gray-500">
                      Qty : {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-xl">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>

                    <p className="text-xs text-gray-500">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Shipping */}

            <div className="rounded-2xl border p-6 border-gray-300">
              <div className="mb-4 flex items-center gap-2">
                <FiMapPin />

                <h3 className="font-semibold">Shipping Address</h3>
              </div>

              <p className="font-semibold">{order.shippingAddress?.fullName}</p>

              <p className="mt-2 text-gray-600">
                {order.shippingAddress?.address}
              </p>

              <p className="text-gray-600">
                {order.shippingAddress?.city}, {order.shippingAddress?.state}
              </p>

              <p className="text-gray-600">
                {order.shippingAddress?.country} -{" "}
                {order.shippingAddress?.postalCode}
              </p>

              <p className="mt-3">📞 {order.shippingAddress?.phone}</p>
            </div>

            {/* Payment */}

            <div className="rounded-2xl border p-6 border-gray-300">
              <div className="mb-4 flex items-center gap-2">
                <FiCreditCard />

                <h3 className="font-semibold">Payment Summary</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>

                  <span>₹{order.totalPrice.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>

                  <span className="text-green-600">FREE</span>
                </div>

                <div className="flex justify-between">
                  <span>Payment</span>

                  <span>{order.paymentMethod}</span>
                </div>

                <div className="flex justify-between border-t pt-4 text-lg font-bold">
                  <span>Total</span>

                  <span>₹{order.totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery */}

          <div className="mt-8 rounded-2xl bg-green-50 p-5">
            <div className="flex items-center gap-3">
              <FiTruck size={22} className="text-green-600" />

              <div>
                <p className="font-semibold">Delivery Status</p>

                <p className="text-sm text-green-700">
                  {order.orderStatus === "Delivered"
                    ? "Your order has been delivered successfully."
                    : `Current Status : ${order.orderStatus}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-gray-300 border-t bg-white px-8 py-5">
          {canCancel && (
            <button
              onClick={() => onCancel(order)}
              className="
                rounded-xl
                bg-red-500
                px-6
                py-3
                font-medium
                text-white
                transition
                hover:bg-red-600
              "
            >
              Cancel Order
            </button>
          )}

          <button
            onClick={onClose}
            className="
              rounded-xl
              border
              px-6
              py-3
              font-medium
              border-gray-300
              transition
              hover:bg-gray-50
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
