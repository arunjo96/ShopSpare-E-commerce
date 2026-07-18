import {Schema, model} from "mongoose";

const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const orderSchema = new Schema(
  {
    /* ---------------- User ---------------- */

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ---------------- Products ---------------- */

    orderItems: [orderItemSchema],

    /* ---------------- Shipping Address ---------------- */

    shippingAddress: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      landmark: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        default: "India",
      },

      postalCode: {
        type: String,
        required: true,
      },
    },

    /* ---------------- Price Details ---------------- */

    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    shippingPrice: {
      type: Number,
      default: 0,
    },

    taxPrice: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    /* ---------------- Payment ---------------- */

    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    paymentId: {
      type: String,
      default: null,
    },

    /* ---------------- Order Status ---------------- */

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    deliveredAt: Date,

    cancelReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 250,
    },

    cancelledAt: Date,
  },
  {
    timestamps: true,
  },
);


const Order = model("Order", orderSchema);

export default Order;
