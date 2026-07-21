export const STATUS_CONFIG = {
  Pending: {
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    badgeBg: "bg-yellow-100",
    icon: "⏱️",
    description: "Awaiting confirmation",
  },
  Confirmed: {
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    badgeBg: "bg-blue-100",
    icon: "✓",
    description: "Order confirmed",
  },
  Processing: {
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    badgeBg: "bg-purple-100",
    icon: "⚙️",
    description: "Being prepared",
  },
  Shipped: {
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-700",
    badgeBg: "bg-cyan-100",
    icon: "📦",
    description: "On the way",
  },
  Delivered: {
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    badgeBg: "bg-green-100",
    icon: "✓✓",
    description: "Successfully delivered",
  },
  Cancelled: {
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    badgeBg: "bg-red-100",
    icon: "✕",
    description: "Order cancelled",
  },
};

export const ORDER_STATUS = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];