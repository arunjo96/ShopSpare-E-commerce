import { useState } from "react";
import { FiEye } from "react-icons/fi";
import { toast } from "react-hot-toast";

import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../services/admin/adminOrderApi";

import OrderDetailsDrawer from "../../components/order/OrderDetailsDrawer";

const ORDER_STATUS = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const AdminOrders = () => {
  const { data, isLoading } = useGetAdminOrdersQuery();

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showDrawer, setShowDrawer] = useState(false);

  const orders = data?.orders || [];

  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      await updateOrderStatus({
        orderId,
        orderStatus,
      }).unwrap();

      toast.success("Order updated");
    } catch (error) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <section className="space-y-6">
        {/* Header */}

        <div>
          <h1 className="text-3xl font-bold">Orders</h1>

          <p className="text-gray-500">Manage customer orders</p>
        </div>

        {/* Cards */}

        {orders.length === 0 ? (
          <div className="rounded-xl border bg-white py-20 text-center text-gray-500">
            No Orders Found
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-bold">#{order._id.slice(-8)}</h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

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

                <div className="mt-5 space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Customer :</span>{" "}
                    {order.user?.name}
                  </p>

                  <p>
                    <span className="font-semibold">Email :</span>{" "}
                    {order.user?.email}
                  </p>

                  <p>
                    <span className="font-semibold">Payment :</span>{" "}
                    {order.paymentMethod}
                  </p>

                  <p>
                    <span className="font-semibold">Total :</span> ₹
                    {order.totalPrice.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Status */}

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium">
                    Order Status
                  </label>

                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="w-full rounded-lg border p-3 outline-none"
                  >
                    {ORDER_STATUS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Button */}

                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowDrawer(true);
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 text-white hover:bg-slate-800"
                >
                  <FiEye />
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Drawer */}

      <OrderDetailsDrawer
        open={showDrawer}
        order={selectedOrder}
        onClose={() => setShowDrawer(false)}
      />
    </>
  );
};

export default AdminOrders;
