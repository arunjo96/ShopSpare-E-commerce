import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
/* ==========================================================
   GET ALL PRODUCTS
========================================================== */

export const getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      isActive: true,
    };

    /* ---------------- Search ---------------- */

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    /* ---------------- Category ---------------- */

  if (category) {
    const categorySlugs = Array.isArray(category) ? category : [category];

    const categories = await Category.find({
      slug: { $in: categorySlugs },
    }).select("_id");

    query.category = {
      $in: categories.map((item) => item._id),
    };
  }

    /* ---------------- Brand ---------------- */

if (brand) {
  const brandSlugs = Array.isArray(brand) ? brand : [brand];

  const brands = await Brand.find({
    slug: { $in: brandSlugs },
  }).select("_id");

  query.brand = {
    $in: brands.map((item) => item._id),
  };
}

    /* ---------------- Price ---------------- */

    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    /* ---------------- Sorting ---------------- */

    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "priceLow":
        sortOption = {
          price: 1,
        };
        break;

      case "priceHigh":
        sortOption = {
          price: -1,
        };
        break;

      case "rating":
        sortOption = {
          averageRating: -1,
        };
        break;

      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;

      default:
        sortOption = {
          createdAt: -1,
        };
    }

    /* ---------------- Pagination ---------------- */

    const currentPage = Number(page);

    const perPage = Number(limit);

    const skip = (currentPage - 1) * perPage;

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category", "name slug")
      .populate("brand", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(perPage);

    return res.status(200).json({
      success: true,

      totalProducts,

      totalPages: Math.ceil(totalProducts / perPage),

      currentPage,

      count: products.length,

      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* ==========================================================
   GET SINGLE PRODUCT
========================================================== */

export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;


    const product = await Product.findById(id)
      .populate("category", "name slug")
      .populate("brand", "name slug");


    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }


    return res.status(200).json({
      success: true,
      product,
    });


  } catch (error) {
    console.error("Get Single Product Error:", error);


    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};