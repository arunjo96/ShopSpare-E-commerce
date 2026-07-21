
import { useEffect, useState } from "react";
import { FiX, FiUploadCloud } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";

import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../services/admin/adminProductApi";

import { useGetCategoriesQuery } from "../services/category/categoryApi";
import { useGetBrandsQuery } from "../services/brand/brandApi";

const AdminProductForm = ({ product, onClose }) => {
  /* ==============================
      API
  ============================== */

  const { data: categoryData } = useGetCategoriesQuery();
  const { data: brandData } = useGetBrandsQuery();

  const [createProduct, { isLoading: creating }] =
    useCreateProductMutation();

  const [updateProduct, { isLoading: updating }] =
    useUpdateProductMutation();

  const categories = categoryData?.categories || [];
  const brands = brandData?.brands || [];

  /* ==============================
      Form State
  ============================== */

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
    brand: "",
    featured: false,
    isActive: true,
  });

  /* ==============================
      Preview Images
  ============================== */

  const [previewImages, setPreviewImages] = useState([]);

  const [selectedPrimaryIndex, setSelectedPrimaryIndex] = useState(0);

  /* ==============================
      Edit Product
  ============================== */


 useEffect(() => {
   if (product) {
     setFormData({
       title: product.title || "",
       description: product.description || "",
       price: product.price ?? "",
       discountPrice: product.discountPrice ?? "",
       stock: product.stock ?? "",
       category: product.category?._id || "",
       brand: product.brand?._id || "",
       featured: product.featured || false,
       isActive: product.isActive ?? true,
     });

     setPreviewImages(
       (product.images || []).map((img) => ({
         url: img.url,
         public_id: img.public_id,
         isNew: false,
       })),
     );

     setSelectedPrimaryIndex(0);
   } else {
     setFormData({
       title: "",
       description: "",
       price: "",
       discountPrice: "",
       stock: "",
       category: "",
       brand: "",
       featured: false,
       isActive: true,
     });

     setPreviewImages([]);
     setSelectedPrimaryIndex(0);
   }
 }, [product]);

  /* ==============================
      Input Change
  ============================== */

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ==============================
      Drag & Drop Upload
  ============================== */

  const onDrop = (acceptedFiles) => {
    const remaining = 5 - previewImages.length;

    if (remaining <= 0) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const files = acceptedFiles.slice(0, remaining);

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true,
    }));

    setPreviewImages((prev) => [...prev, ...newImages]);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
    },
  });

  /* ==============================
      Set Main Image
  ============================== */

const setAsPrimary = (index) => {
  setSelectedPrimaryIndex(index);
};

  /* ==============================
      Remove Image
  ============================== */

const removeImage = (index) => {
  setPreviewImages((prev) => prev.filter((_, i) => i !== index));

  if (selectedPrimaryIndex === index) {
    setSelectedPrimaryIndex(0);
  } else if (selectedPrimaryIndex > index) {
    setSelectedPrimaryIndex((prev) => prev - 1);
  }
};

  const isLoading = creating || updating;

  
  return (
    <form
      className="space-y-4 
    "
      onSubmit={handleSubmit}
    >
      {/* ==============================
            Product Title
      ============================== */}

      <div>
        <label className="mb-2 block font-medium">Product Title</label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter Product Title"
          className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-400"
        />
      </div>

      {/* ==============================
            Description
      ============================== */}

      <div>
        <label className="mb-2 block font-medium">Description</label>

        <textarea
          rows={5}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter Product Description"
          className="w-full rounded-lg border p-3 outline-none border-gray-300 focus:border-gray-400"
        />
      </div>

      {/* ==============================
            Drag & Drop Images
      ============================== */}

      <div>
        <label className="mb-2 block font-medium">Product Images</label>

        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-8 transition
          ${
            isDragActive
              ? "border-gray-400 bg-slate-100"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center justify-center text-center">
            <FiUploadCloud size={50} className="mb-4 text-slate-700" />

            <h3 className="text-lg font-semibold">
              {isDragActive ? "Drop Images Here" : "Drag & Drop Images"}
            </h3>

            <p className="mt-2 text-sm text-gray-500">or Click to Browse</p>

            <p className="mt-1 text-xs text-gray-400">
              PNG, JPG, JPEG (Maximum 5 Images)
            </p>
          </div>
        </div>

        {previewImages.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-5">
            {previewImages.map((image, index) => (
              <div
                key={index}
                onClick={() => setAsPrimary(index)}
                className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 transition
          ${
            index === 0
              ? "border-blue-600 ring-2 ring-blue-200"
              : "border-gray-200 hover:border-slate-900"
          }`}
              >
                <img
                  src={image.url}
                  alt=""
                  className="h-36 w-full object-cover"
                />

                {/* Main Image Badge */}

                {index === selectedPrimaryIndex && (
                  <span className="absolute left-2 bottom-2 rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                    Main Image
                  </span>
                )}

                {/* New Badge */}

                {image.isNew && (
                  <span className="absolute left-2 top-2 rounded bg-green-600 px-2 py-1 text-xs text-white">
                    New
                  </span>
                )}

                {/* Remove */}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <FiX size={16} />
                </button>

                {/* Click Hint */}

                <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-xs text-white opacity-0 transition group-hover:opacity-100">
                  Click to set as Main
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==============================
            Price
      ============================== */}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">Price</label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0"
            className="w-full rounded-lg border p-3 outline-none border-gray-300 focus:border-gray-400"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Discount Price</label>

          <input
            type="number"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            placeholder="0"
            className="w-full rounded-lg border p-3 outline-none focus:border-gray-400 border-gray-300"
          />
        </div>
      </div>

      {/* ==============================
            Stock
      ============================== */}

      <div>
        <label className="mb-2 block font-medium">Stock</label>

        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Available Stock"
          className="w-full rounded-lg border p-3 outline-none focus:border-gray-400 border-gray-300"
        />
      </div>

      {/* ==============================
            Category & Brand
      ============================== */}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">Category</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-lg capitalize border p-3 cursor-pointer outline-none focus:border-gray-400 border-gray-300"
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">Brand</label>

          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full capitalize rounded-lg border cursor-pointer p-3 outline-none focus:border-gray-400 border-gray-300"
          >
            <option value="">Select Brand</option>

            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ==============================
            Featured & Active
      ============================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-indigo-500 hover:shadow-sm">
          <div>
            <p className="font-medium text-gray-900">Featured Product</p>
            <p className="text-sm text-gray-500">
              Highlight this product on the homepage.
            </p>
          </div>

          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-5 w-5 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        </label>

        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-green-500 hover:shadow-sm">
          <div>
            <p className="font-medium text-gray-900">Active Product</p>
            <p className="text-sm text-gray-500">
              Make this product visible to customers.
            </p>
          </div>

          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-5 w-5 cursor-pointer rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
        </label>
      </div>

      {/* ==============================
            Footer Buttons
      ============================== */}

      <div className="flex justify-end gap-3 border-gray-400 border-t pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-500 px-6 py-3 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {isLoading
            ? "Saving..."
            : product
              ? "Update Product"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
      /* ==============================
      Submit
  ============================== */

 async function handleSubmit(e) {
   e.preventDefault();

   if (
     !formData.title.trim() ||
     !formData.description.trim() ||
     !formData.price ||
     !formData.stock ||
     !formData.category
   ) {
     toast.error("Please fill all required fields");
     return;
   }

   try {
     const data = new FormData();

     data.append("title", formData.title.trim());
     data.append("description", formData.description.trim());
     data.append("price", Number(formData.price));
     data.append("discountPrice", Number(formData.discountPrice) || 0);
     data.append("stock", Number(formData.stock));
     data.append("category", formData.category);

     if (formData.brand) {
       data.append("brand", formData.brand);
     }

     data.append("featured", formData.featured);
     data.append("isActive", formData.isActive);

     // Image Order
     const imageOrder = previewImages.map((img, index) => ({
       type: img.isNew ? "new" : "old",
       index,
       isPrimary: index === selectedPrimaryIndex,
       public_id: img.public_id || null,
     }));

     data.append("imageOrder", JSON.stringify(imageOrder));

     // Upload only new images
     previewImages.forEach((img) => {
       if (img.isNew) {
         data.append("images", img.file);
       }
     });

     if (product) {
       await updateProduct({
         id: product._id,
         formData: data,
       }).unwrap();

       toast.success("Product updated successfully");
     } else {
       await createProduct(data).unwrap();

       toast.success("Product created successfully");
     }

     onClose();
   } catch (error) {
     console.error(error);

     toast.error(error?.data?.message || "Something went wrong");
   }
 }
};

export default AdminProductForm;