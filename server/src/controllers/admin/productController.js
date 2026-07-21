import  imageUploadUtil  from "../../utils/cloudinaryUpload.js";
import slugify from "slugify";

import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import Brand from "../../models/Brand.js";
import cloudinary from "../../config/cloudinary.js";



export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountPrice,
      stock,
      category,
      brand,
      featured,
    } = req.body;


    /* ---------------- Validation ---------------- */

    if (!title || !description || !price || !stock || !category) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    /* ---------------- Category ---------------- */

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    /* ---------------- Brand ---------------- */

    if (brand) {
      const brandExists = await Brand.findById(brand);

      if (!brandExists) {
        return res.status(404).json({
          success: false,
          message: "Brand not found",
        });
      }
    }

    /* ---------------- Duplicate ---------------- */

    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

   console.log("Generated slug:", slug);

   const productExists = await Product.findOne({ slug });

   console.log("Existing Product:", productExists);

   if (productExists) {
     return res.status(409).json({
       success: false,
       message: "Product already exists",
     });
   }

    /* ---------------- Images ---------------- */

    const images = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const result = await imageUploadUtil(file.buffer);

        images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    /* ---------------- Create ---------------- */

    const product = await Product.create({
      title,
      slug,
      description,
      price,
      discountPrice,
      stock,
      category,
      brand,
      featured,
      images,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/* ==========================================================
   UPDATE PRODUCT
========================================================== */

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      title,
      description,
      price,
      discountPrice,
      stock,
      category,
      brand,
      featured,
      isActive,
      imageOrder,
    } = req.body;

    /* ---------------- Category Validation ---------------- */

    if (category) {
      const categoryExists = await Category.findById(category);

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    /* ---------------- Brand Validation ---------------- */

    if (brand) {
      const brandExists = await Brand.findById(brand);

      if (!brandExists) {
        return res.status(404).json({
          success: false,
          message: "Brand not found",
        });
      }
    }

    /* ---------------- Images ---------------- */

    let images = [];

    const order = imageOrder ? JSON.parse(imageOrder) : [];

    // Upload new images
    const uploadedImages = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const result = await imageUploadUtil(file.buffer);

        uploadedImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    // Existing images map
    const oldImagesMap = {};

    product.images.forEach((img) => {
      oldImagesMap[img.public_id] = img;
    });

    // Build final image array
    let uploadedIndex = 0;

    for (const item of order) {
      if (item.type === "old") {
        if (oldImagesMap[item.public_id]) {
          images.push(oldImagesMap[item.public_id]);
        }
      } else {
        if (uploadedImages[uploadedIndex]) {
          images.push(uploadedImages[uploadedIndex]);
          uploadedIndex++;
        }
      }
    }

    /* ---------------- Update Product ---------------- */

 const oldSlugData = `${product.title}-${product.brand}-${product.category}`;

 product.title = title ?? product.title;
 product.description = description ?? product.description;
 product.price = price ?? product.price;
 product.discountPrice = discountPrice ?? product.discountPrice;
 product.stock = stock ?? product.stock;
 product.category = category ?? product.category;
 product.brand = brand ?? product.brand;
 product.featured = featured ?? product.featured;
 product.isActive = isActive ?? product.isActive;

 const newSlugData = `${product.title}-${product.brand}-${product.category}`;

 if (oldSlugData !== newSlugData) {
   product.slug = slugify(newSlugData, {
     lower: true,
     strict: true,
   });
 }

 product.images = images;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



/* ==========================================================
   GETADMIN PRODUCT
========================================================== */

export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("brand", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


/* ==========================================================
   DELETE PRODUCT
========================================================== */

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;


    const product = await Product.findById(id);


    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }


    if (product.images && product.images.length > 0) {

      for (const image of product.images) {

        await cloudinary.uploader.destroy(
          image.public_id
        );

      }
    }

    await Product.findByIdAndDelete(id);


    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });


  } catch (error) {

    console.error(
      "Delete Product Error:",
      error
    );


    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
