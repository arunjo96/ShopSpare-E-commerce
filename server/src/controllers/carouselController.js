import Carousel from "../models/Carousel.js";

/* ==========================================================
   GET ACTIVE CAROUSELS
========================================================== */

export const getCarousels = async (req, res) => {
  try {
    const carousels = await Carousel.find({
      isActive: true,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: carousels.length,
      carousels,
    });
  } catch (error) {
    console.error("Get Carousels Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
