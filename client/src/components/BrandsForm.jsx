import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from "../services/admin/adminBrandApi";

const BrandForm = ({ brand, onClose }) => {
  const [name, setName] = useState("");

  const [createBrand, { isLoading: creating }] = useCreateBrandMutation();

  const [updateBrand, { isLoading: updating }] = useUpdateBrandMutation();

  useEffect(() => {
    if (brand) {
      setName(brand.name);
    } else {
      setName("");
    }
  }, [brand]);

  const isLoading = creating || updating;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    try {
      if (brand) {
        await updateBrand({
          id: brand._id,
          name: name.trim(),
        }).unwrap();

        toast.success("Brand updated successfully");
      } else {
        await createBrand({
          name: name.trim(),
        }).unwrap();

        toast.success("Brand created successfully");
      }

      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-0">
      <div>
        <label className="mb-2 block font-medium">Brand Name</label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter brand name"
          className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-400"
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-400 pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-400 px-6 py-3 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-slate-900 px-6 py-3 text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : brand ? "Update Brand" : "Create Brand"}
        </button>
      </div>
    </form>
  );
};

export default BrandForm;
