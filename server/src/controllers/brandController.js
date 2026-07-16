import Brand from "../models/Brand.js";

/* ==========================================================
   GET ALL BRANDS
========================================================== */

export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({
      isActive: true,
    }).sort({
      name: 1,
    });

    return res.status(200).json({
      success: true,
      count: brands.length,
      brands,
    });
  } catch (error) {
    console.error("Get Brands Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
