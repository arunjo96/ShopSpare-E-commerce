import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "../services/admin/adminCategoryApi";

const CategoryForm = ({ category, onClose }) => {
  const [name, setName] = useState("");

  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();

  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();

  useEffect(() => {
    if (category) {
      setName(category.name);
    } else {
      setName("");
    }
  }, [category]);

  const isLoading = creating || updating;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (category) {
        await updateCategory({
          id: category._id,
          name: name.trim(),
        }).unwrap();

        toast.success("Category updated successfully");
      } else {
        await createCategory({
          name: name.trim(),
        }).unwrap();

        toast.success("Category created successfully");
      }

      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-0">
      <div>
        <label className="mb-2 block font-medium">Category Name</label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          className="w-full rounded-lg border p-3 outline-none focus:border-gray-400 border-gray-300"
        />
      </div>

      <div className="flex justify-end gap-3 border-gray-400 border-t pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border px-6 py-3 hover:bg-gray-100 border-gray-400"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-slate-900 px-6 py-3 text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {isLoading
            ? "Saving..."
            : category
              ? "Update Category"
              : "Create Category"}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
