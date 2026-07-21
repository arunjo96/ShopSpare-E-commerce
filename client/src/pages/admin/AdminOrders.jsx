
import { useState } from "react";
import {
  FiEye,
  FiChevronDown,
  FiPackage,
  FiTruck,
  FiCheckCircle,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../services/admin/adminOrderApi";

import OrderDetailsDrawer from "../../components/OrderDetailsDrawer";

import { STATUS_CONFIG, ORDER_STATUS } from "../../constants";





const getPaymentBadgeStyle = (status) => {
  return status === "Paid"
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";
};

const AdminOrders = () => {
  const { data, isLoading } = useGetAdminOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  const orders = data?.orders || [];

  // Filter orders
  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.orderStatus === filterStatus);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({
        orderId,
        orderStatus: newStatus,
      }).unwrap();

      toast.success("Order status updated");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update order");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-slate-900"></div>
          </div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="w-full space-y-6 p-0 mt-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Orders
            </h1>
            <p className="mt-1 text-sm text-gray-600 sm:text-base">
              Manage {filteredOrders.length} customer order
              {filteredOrders.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Filter */}
          <div className="relative w-full sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400  focus:outline-none "
            >
              <option value="All">All Orders</option>
              {ORDER_STATUS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
          </div>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <FiPackage className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No orders found
            </h3>
            <p className="text-sm text-gray-600">
              {filterStatus !== "All"
                ? `No orders with status "${filterStatus}"`
                : "Start accepting orders to see them here"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="max-h-[650px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 overflow-auto rounded-lg border border-gray-300 bg-white">
                <table className="border-collapse w-full">
                  <thead className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50">
                    <tr>
                      <th className="w-32 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                        Order ID
                      </th>
                      <th className="w-32 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                        Customer
                      </th>
                      <th className="w-32 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                        Total
                      </th>
                      <th className="w-32 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                        Payment
                      </th>
                      <th className="w-32 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                        Status
                      </th>
                      <th className="w-32  px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => {
                      const statusConfig = STATUS_CONFIG[order.orderStatus];
                      return (
                        <tr
                          key={order._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className="font-semibold text-gray-900">
                              #{order._id.toUpperCase()}
                            </span>
                            <div className="mt-1 text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {order.user?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {order.user?.email}
                              </p>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-900">
                            ₹{order.totalPrice.toLocaleString("en-IN")}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getPaymentBadgeStyle(order.paymentStatus)}`}
                            >
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {statusConfig.icon}
                              </span>
                              <select
                                value={order.orderStatus}
                                onChange={(e) =>
                                  handleStatusChange(order._id, e.target.value)
                                }
                                className="rounded border cursor-pointer border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400  focus:outline-none"
                              >
                                {ORDER_STATUS.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowDrawer(true);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800 "
                            >
                              <FiEye className="h-4 w-4" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile & Tablet Card View */}
            <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
              {filteredOrders.map((order) => {
                const statusConfig = STATUS_CONFIG[order.orderStatus];
                return (
                  <div
                    key={order._id}
                    className={`rounded-lg border border-gray-200 transition-all hover:shadow-md ${statusConfig.bgColor}`}
                  >
                    <div className="space-y-4 p-4 sm:p-5">
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="truncate font-bold text-gray-900">
                            #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getPaymentBadgeStyle(order.paymentStatus)}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-2 border-t border-gray-200 border-opacity-30 pt-3">
                        <div>
                          <p className="text-xs font-medium text-gray-700">
                            Customer
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {order.user?.name}
                          </p>
                          <p className="truncate text-xs text-gray-600">
                            {order.user?.email}
                          </p>
                        </div>

                        <div className="flex justify-between gap-4">
                          <div>
                            <p className="text-xs font-medium text-gray-700">
                              Payment Method
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {order.paymentMethod}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-gray-700">
                              Total
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              ₹{order.totalPrice.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status Section */}
                      <div className="border-t border-gray-200 border-opacity-30 pt-3">
                        <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-700">
                          <span className="text-base">{statusConfig.icon}</span>
                          Order Status
                        </label>
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm transition-all  focus:outline-none "
                        >
                          {ORDER_STATUS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-600">
                          {statusConfig.description}
                        </p>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDrawer(true);
                        }}
                        className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition-all hover:bg-slate-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <FiEye className="h-4 w-4" />
                          <span>View Details</span>
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
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