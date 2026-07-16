import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/* ==========================================================
   ADD TO CART
========================================================== */

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId, quantity } = req.body;

    /* ---------------- Validation ---------------- */

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product is required",
      });
    }

    const qty = Number(quantity) || 1;

    if (qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    /* ---------------- Product ---------------- */

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock < qty) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    /* ---------------- Cart ---------------- */

    let cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    /* ---------------- Existing Product ---------------- */

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + qty;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Quantity exceeds available stock",
        });
      }

      cart.items[itemIndex].quantity = newQuantity;
    } else {
      cart.items.push({
        product: product._id,
        quantity: qty,
        price: product.discountPrice || product.price,
      });
    }

    /* ---------------- Totals ---------------- */

    cart.totalItems = cart.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    await cart.save();

    await cart.populate({
      path: "items.product",
      select: "title images price discountPrice stock",
    });

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ==========================================================
   GET CART
========================================================== */

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({
      user: userId,
    }).populate({
      path: "items.product",
      select: "title slug images price discountPrice stock isActive",
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          items: [],
          totalItems: 0,
          totalAmount: 0,
        },
      });
    }

    /* ----------------------------------------------------
       Remove Deleted / Inactive / Out Of Stock Products
    ----------------------------------------------------- */

    let updated = false;

    cart.items = cart.items.filter((item) => {
      if (!item.product || !item.product.isActive || item.product.stock <= 0) {
        updated = true;
        return false;
      }

      return true;
    });

    /* ----------------------------------------------------
       Update Latest Price
    ----------------------------------------------------- */

    cart.items.forEach((item) => {
      const latestPrice = item.product.discountPrice || item.product.price;

      if (item.price !== latestPrice) {
        item.price = latestPrice;
        updated = true;
      }

      if (item.quantity > item.product.stock) {
        item.quantity = item.product.stock;
        updated = true;
      }
    });

    /* ----------------------------------------------------
       Recalculate Totals
    ----------------------------------------------------- */

    cart.totalItems = cart.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    if (updated) {
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not available",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available`,
      });
    }

    item.quantity = quantity;
    item.price = product.discountPrice || product.price;

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );

    await cart.save();

    await cart.populate({
      path: "items.product",
      select: "title slug images price discountPrice stock",
    });

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Update Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Remove Cart Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.totalAmount = 0;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Clear Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};