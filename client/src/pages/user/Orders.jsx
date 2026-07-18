
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiPackage,
  FiEye,
  FiXCircle,
  FiShoppingBag,
} from "react-icons/fi";

import {
  useGetMyOrdersQuery,
  useCancelOrderMutation,
} from "../../services/order/orderApi";

import OrderDetailsModal from "../../components/order/OrderDetailsModal";

import CancelOrderModal from "../../components/order/CancelOrderModal";

const Orders = () => {
  const { data, isLoading, isError } = useGetMyOrdersQuery();

  const [cancelOrder] = useCancelOrderMutation();

  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = data?.orders || [];


  const [cancelOrderOpen, setCancelOrderOpen] = useState(false);

  const [orderToCancel, setOrderToCancel] = useState(null);

  const [cancelLoading, setCancelLoading] = useState(false);



const handleCancel = async (orderId, reason) => {
  try {
    setCancelLoading(true);

    await cancelOrder({
      orderId,
      reason,
    }).unwrap();

    toast.success("Order cancelled successfully");

    setCancelOrderOpen(false);
    setOrderToCancel(null);
  } catch (error) {
    toast.error(error?.data?.message || "Unable to cancel order");
  } finally {
    setCancelLoading(false);
  }
};

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="animate-pulse text-lg font-medium text-gray-500">
          Loading Orders...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-red-500">Failed to load orders.</p>
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-9/10 md:p-15 p-8 bg-white pt-10 border border-gray-300 rounded-2xl">
          {/* Header */}

          <div className="mb-8 flex items-center gap-4">
            <div className="rounded-2xl bg-black p-4 text-white">
              <FiShoppingBag size={26} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">My Orders</h1>

              <p className="text-gray-500">
                {orders.length} Order{orders.length !== 1 && "s"}
              </p>
            </div>
          </div>

          {/* Empty */}

          {orders.length === 0 ? (
            <div className="rounded-3xl bg-white py-20 text-center shadow-sm">
              <FiPackage size={60} className="mx-auto mb-5 text-gray-300" />

              <h2 className="text-2xl font-bold">No Orders Yet</h2>

              <p className="mt-2 text-gray-500">
                Your purchased products will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b bg-gray-100 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Product
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Date
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Total
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Payment
                      </th>

                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map(
                      (order) => (
                        (
                          <tr
                            key={order._id}
                            className="border-b transition hover:bg-gray-50 border-gray-200 "
                          >
                            <td className="px-6 py-5">
                              <p className="max-w-[180px] truncate font-medium">
                                #{order._id}
                              </p>
                            </td>
                            <td className="px-6 py-5">
                              <p className=" font-medium capitalize">
                                {order.orderItems?.[0]?.title}
                              </p>
                            </td>

                            <td className="px-6 py-5">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>

                            <td className="px-6 py-5 font-semibold">
                              ₹{order.totalPrice.toLocaleString("en-IN")}
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium
                              ${
                                order.orderStatus === "Delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.orderStatus === "Cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                              >
                                {order.orderStatus}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium
                              ${
                                order.paymentStatus === "Paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                              >
                                {order.paymentStatus}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center justify-center gap-2">
                                {/* View Details */}

                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-black
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-gray-800
                              "
                                >
                                  <FiEye size={16} />
                                  View
                                </button>

                                {/* Cancel */}

                                {(order.orderStatus === "Pending" ||
                                  order.orderStatus === "Confirmed") && (
                                  <button
                                    onClick={() => {
                                      setOrderToCancel(order);
                                      setCancelOrderOpen(true);
                                    }}
                                    className="
      flex
      items-center
      gap-2
      rounded-xl
      bg-red-500
      px-4
      py-2
      text-sm
      font-medium
      text-white
      transition
      hover:bg-red-600
    "
                                  >
                                    <FiXCircle size={16} />
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Order Details Modal */}

      <OrderDetailsModal
        isOpen={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onCancel={(order) => {
          setOrderToCancel(order);
          setCancelOrderOpen(true);
        }}
      />

      <CancelOrderModal
        isOpen={cancelOrderOpen}
        onClose={() => {
          setCancelOrderOpen(false);
          setOrderToCancel(null);
        }}
        loading={cancelLoading}
        onConfirm={(reason) => {
          handleCancel(orderToCancel._id, reason);
        }}
      />
    </>
  );
};

export default Orders;