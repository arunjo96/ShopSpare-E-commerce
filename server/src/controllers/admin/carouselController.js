import Carousel from "../../models/Carousel.js";
import imageUploadUtil from "../../utils/cloudinaryUpload.js";
import cloudinary from "../../config/cloudinary.js";


/* ==========================================================
   CREATE CAROUSEL
========================================================== */

export const createCarousel = async (req, res) => {
  try {
    const { title, subtitle, buttonText, buttonLink, order, isActive } =
      req.body;

    /* ---------------- Validation ---------------- */

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Carousel image is required",
      });
    }

    /* ---------------- Upload Image ---------------- */

    const result = await imageUploadUtil(req.file.buffer);

    /* ---------------- Create ---------------- */

    const carousel = await Carousel.create({
      title,
      subtitle,
      buttonText,
      buttonLink,
      order: order || 0,
      isActive: isActive === undefined ? true : isActive === "true",

      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Carousel created successfully",
      carousel,
    });
  } catch (error) {
    console.error("Create Carousel Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


/* ==========================================================
   UPDATE CAROUSEL
========================================================== */

export const updateCarousel = async (req, res) => {
  try {
    const { id } = req.params;

    const carousel = await Carousel.findById(id);

    if (!carousel) {
      return res.status(404).json({
        success: false,
        message: "Carousel not found",
      });
    }

    const {
      title,
      subtitle,
      buttonText,
      buttonLink,
      order,
      isActive,
    } = req.body;

    /* ---------------- Upload New Image ---------------- */

    let image = carousel.image;

    if (req.file) {
      // Delete old image
      if (carousel.image?.public_id) {
        await cloudinary.uploader.destroy(carousel.image.public_id);
      }

      const result = await imageUploadUtil(req.file.buffer);

      image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    /* ---------------- Update ---------------- */

    carousel.title = title ?? carousel.title;
    carousel.subtitle = subtitle ?? carousel.subtitle;
    carousel.buttonText = buttonText ?? carousel.buttonText;
    carousel.buttonLink = buttonLink ?? carousel.buttonLink;
    carousel.order = order ?? carousel.order;

    if (isActive !== undefined) {
      carousel.isActive = isActive === "true";
    }

    carousel.image = image;

    await carousel.save();

    return res.status(200).json({
      success: true,
      message: "Carousel updated successfully",
      carousel,
    });
  } catch (error) {
    console.error("Update Carousel Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/* ==========================================================
   DELETE CAROUSEL
========================================================== */

export const deleteCarousel = async (req, res) => {
  try {
    const { id } = req.params;

    const carousel = await Carousel.findById(id);

    if (!carousel) {
      return res.status(404).json({
        success: false,
        message: "Carousel not found",
      });
    }

    if (carousel.image?.public_id) {
      await cloudinary.uploader.destroy(carousel.image.public_id);
    }

    await Carousel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Carousel deleted successfully",
    });
  } catch (error) {
    console.error("Delete Carousel Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/* ==========================================================
   GET ADMIN CAROUSELS
========================================================== */

export const getAdminCarousels = async (req, res) => {
  try {
    const carousels = await Carousel.find().sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: carousels.length,
      carousels,
    });
  } catch (error) {
    console.error("Get Admin Carousels Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};