import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

/* ==========================================================
   ADD TO WISHLIST
========================================================== */

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    /* ---------------- Validation ---------------- */

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product is required",
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

    /* ---------------- Wishlist ---------------- */

    let wishlist = await Wishlist.findOne({
      user: userId,
    });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        items: [],
      });
    }

    /* ---------------- Duplicate ---------------- */

    const alreadyExists = wishlist.items.some(
      (item) => item.product.toString() === productId,
    );

    if (alreadyExists) {
      return res.status(409).json({
        success: false,
        message: "Product already exists in wishlist",
      });
    }

    /* ---------------- Add ---------------- */

    wishlist.items.push({
      product: product._id,
    });

    await wishlist.save();

    await wishlist.populate({
      path: "items.product",
      select: "title slug images price discountPrice averageRating stock",
    });

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Add Wishlist Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({
      user: userId,
    }).populate({
      path: "items.product",
      select:
        "title slug images price discountPrice averageRating stock isActive",
    });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        wishlist: {
          items: [],
        },
      });
    }

    /* ----------------------------------------------------
       Remove Deleted / Inactive / Out Of Stock Products
    ----------------------------------------------------- */

    let updated = false;

    wishlist.items = wishlist.items.filter((item) => {
      if (!item.product || !item.product.isActive || item.product.stock <= 0) {
        updated = true;
        return false;
      }

      return true;
    });

    if (updated) {
      await wishlist.save();
    }

    return res.status(200).json({
      success: true,
      count: wishlist.items.length,
      wishlist,
    });
  } catch (error) {
    console.error("Get Wishlist Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: userId,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({
      user: userId,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.items = [];

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
    });
  } catch (error) {
    console.error("Clear Wishlist Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};