import Category from "../../models/Category.js";

/* ==========================================================
   CREATE CATEGORY
========================================================== */

export const createCategory = async (req, res) => {
  try {
      const { name } = req.body;
      
      console.log("Create Category Request Body:", req.body);

    /* ---------------- Validation ---------------- */

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    /* ---------------- Duplicate Check ---------------- */

    const existingCategory = await Category.findOne({
      name: {
        $regex: new RegExp(`^${name.trim()}$`, "i"),
      },
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    /* ---------------- Create Category ---------------- */

    const category = await Category.create({
      name: name.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* ==========================================================
   UPDATE CATEGORY
========================================================== */

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Duplicate Check
    if (name) {
      const existingCategory = await Category.findOne({
        _id: { $ne: id },
        name: {
          $regex: new RegExp(`^${name.trim()}$`, "i"),
        },
      });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: "Category already exists",
        });
      }

      category.name = name.trim();
    }

    if (typeof isActive !== "undefined") {
      category.isActive = isActive;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* ==========================================================
   DELETE CATEGORY
========================================================== */

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.isActive = false;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
