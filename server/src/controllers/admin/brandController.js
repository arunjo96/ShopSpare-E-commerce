import Brand from "../../models/Brand.js";

/* ==========================================================
   CREATE BRAND
========================================================== */

export const createBrand = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }

      console.log("Create Brand Request Body:", req.body);

    const existingBrand = await Brand.findOne({
      name: {
        $regex: new RegExp(`^${name.trim()}$`, "i"),
      },
    });

     if (existingBrand) {
       // Restore deleted category
       if (!existingBrand.isActive) {
         existingBrand.isActive = true;

         await existingBrand.save();

         return res.status(200).json({
           success: true,
           message: "Category restored successfully",
           category: existingBrand,
         });
       }

       return res.status(409).json({
         success: false,
         message: "Category already exists",
       });
     }

    if (existingBrand) {
      return res.status(409).json({
        success: false,
        message: "Brand already exists",
      });
    }

    const brand = await Brand.create({
      name: name.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Brand created successfully",
      brand,
    });
  } catch (error) {
    console.error("Create Brand Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ==========================================================
   UPDATE BRAND
========================================================== */

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    if (name) {
      const existingBrand = await Brand.findOne({
        _id: { $ne: id },
        name: {
          $regex: new RegExp(`^${name.trim()}$`, "i"),
        },
      });

      if (existingBrand) {
        return res.status(409).json({
          success: false,
          message: "Brand already exists",
        });
      }

      brand.name = name.trim();
    }

    if (typeof isActive !== "undefined") {
      brand.isActive = isActive;
    }

    await brand.save();

    return res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      brand,
    });
  } catch (error) {
    console.error("Update Brand Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ==========================================================
   DELETE BRAND
========================================================== */

export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    // Soft Delete
    brand.isActive = false;

    await brand.save();

    return res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("Delete Brand Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
