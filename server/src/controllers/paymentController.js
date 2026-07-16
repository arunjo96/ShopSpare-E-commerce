import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Order from "../models/Order.js";




/* ==========================================================
   CREATE RAZORPAY ORDER
========================================================== */

export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    /* ---------------- Validation ---------------- */

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    /* ---------------- Find Order ---------------- */

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    /* ---------------- User Validation ---------------- */

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    /* ---------------- Already Paid ---------------- */

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    /* ---------------- Razorpay Options ---------------- */

    const options = {
      amount: Math.round(order.totalPrice * 100), // paise
      currency: "INR",
      receipt: order._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Create Razorpay Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* ==========================================================
   VERIFY RAZORPAY PAYMENT
========================================================== */

export const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    /* ---------------- Validation ---------------- */

    if (
      !orderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are required",
      });
    }

    /* ---------------- Find Order ---------------- */

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    /* ---------------- Verify Signature ---------------- */

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    /* ---------------- Update Order ---------------- */

    order.paymentStatus = "Paid";
    order.paymentId = razorpay_payment_id;
    order.orderStatus = "Confirmed";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });

  } catch (error) {
    console.error("Verify Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
