import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

/* ==========================================================
   CREATE ORDER
========================================================== */

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const { shippingAddress, paymentMethod } = req.body;

    /* ---------------- Validation ---------------- */

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }

    /* ---------------- Cart ---------------- */

    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    /* ---------------- Prepare Order ---------------- */

    const orderItems = [];

    let itemsPrice = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: `${item.product.title} is unavailable`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} stock available for ${product.title}`,
        });
      }

      const price = product.discountPrice || product.price;

      const totalPrice = price * item.quantity;

      itemsPrice += totalPrice;

      orderItems.push({
        product: product._id,

        title: product.title,

        image: product.images[0]?.url || "",

        price,

        quantity: item.quantity,

        totalPrice,
      });
    }

    /* ---------------- Charges ---------------- */

    const shippingPrice = 0;

    const taxPrice = 0;

    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    /* ---------------- Create Order ---------------- */

    const order = await Order.create({
      user: userId,

      orderItems,

      shippingAddress,

      itemsPrice,

      shippingPrice,

      taxPrice,

      totalPrice,

      paymentMethod,

      paymentStatus: paymentMethod === "COD" ? "Pending" : "Pending",

      orderStatus: "Pending",
    });

    /* ---------------- Reduce Product Stock ---------------- */

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: {
          stock: -item.quantity,
        },
      });
    }

    /* ---------------- Clear Cart ---------------- */

    cart.items = [];
    cart.totalItems = 0;
    cart.totalAmount = 0;

    await cart.save();

    /* ---------------- Populate ---------------- */

    await order.populate([
      {
        path: "user",
        select: "name email",
      },
      {
        path: "orderItems.product",
        select: "title slug",
      },
    ]);

    /* ---------------- Response ---------------- */

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* ==========================================================
   GET MY ORDERS
========================================================== */

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .populate("orderItems.product", "title slug images");

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* ==========================================================
   GET SINGLE ORDER
========================================================== */

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("orderItems.product", "title slug images");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ==========================================================
   CANCEL ORDER
========================================================== */

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (
      order.orderStatus !== "Pending" &&
      order.orderStatus !== "Confirmed"
    ) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled",
      });
    }

    order.orderStatus = "Cancelled";
    order.cancelledAt = new Date();

    /* ---------------- Restore Stock ---------------- */

    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: item.quantity,
        },
      });
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};