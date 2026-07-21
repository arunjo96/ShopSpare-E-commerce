
import { useEffect, useState } from "react";
import {
  FiUpload,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiSave,
  FiX,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import {
  useGetAdminCarouselsQuery,
  useCreateCarouselMutation,
  useUpdateCarouselMutation,
  useDeleteCarouselMutation,
} from "../../services/admin/adminCarouselApi";

const initialState = {
  title: "",
  subtitle: "",
  buttonText: "",
  buttonLink: "",
  order: 0,
  isActive: true,
};

const Dashboard = () => {
  /* =====================================================
        API
  ===================================================== */

  const { data, isLoading } = useGetAdminCarouselsQuery();

  const [createCarousel, { isLoading: creating }] =
    useCreateCarouselMutation();

  const [updateCarousel, { isLoading: updating }] =
    useUpdateCarouselMutation();

  const [deleteCarousel] = useDeleteCarouselMutation();

  /* =====================================================
        STATES
  ===================================================== */

  const [form, setForm] = useState(initialState);

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState("");

  const [editing, setEditing] = useState(null);

  /* =====================================================
        EDIT MODE
  ===================================================== */

  useEffect(() => {
    if (!editing) {
      setForm(initialState);
      setPreview("");
      setImage(null);
      return;
    }

    setForm({
      title: editing.title,
      subtitle: editing.subtitle,
      buttonText: editing.buttonText,
      buttonLink: editing.buttonLink,
      order: editing.order,
      isActive: editing.isActive,
    });

    setPreview(editing.image.url);
  }, [editing]);

  /* =====================================================
        INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =====================================================
        IMAGE CHANGE
  ===================================================== */

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  /* =====================================================
        RESET
  ===================================================== */

  const resetForm = () => {
    setEditing(null);

    setImage(null);

    setPreview("");

    setForm(initialState);
  };

  /* =====================================================
        SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("subtitle", form.subtitle);
      formData.append("buttonText", form.buttonText);
      formData.append("buttonLink", form.buttonLink);
      formData.append("order", form.order);
      formData.append("isActive", form.isActive);

      if (image) {
        formData.append("image", image);
      }

      if (editing) {
        await updateCarousel({
          id: editing._id,
          formData,
        }).unwrap();

        toast.success("Carousel updated");
      } else {
        if (!image) {
          return toast.error("Please select an image");
        }

        await createCarousel(formData).unwrap();

        toast.success("Carousel created");
      }

      resetForm();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const carousels = data?.carousels || [];

  return (
    <div className="space-y-8">
      {/* =====================================================
            PAGE TITLE
      ===================================================== */}

      <div className="py-10 pb-4">
        <h1 className="text-3xl font-bold text-slate-900">
          Carousel Management
        </h1>

        <p className="mt-1 text-gray-500">
          Upload and manage homepage slider images.
        </p>
      </div>

      {/* =====================================================
            FORM
      ===================================================== */}

      <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="grid gap-6 md:grid-cols-2"
        >
          {/* LEFT SIDE STARTS HERE */}

                    {/* =====================================================
                LEFT SIDE
          ===================================================== */}

          <div className="space-y-5">
            {/* Title */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Summer Collection 2026"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-slate-500"
                
              />
            </div>

            {/* Subtitle */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Subtitle
              </label>

              <textarea
                rows={4}
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                placeholder="Write a short description..."
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-slate-500"
              />
            </div>

            {/* Button Text */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Button Text
              </label>

              <input
                type="text"
                name="buttonText"
                value={form.buttonText}
                onChange={handleChange}
                placeholder="Shop Now"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-slate-500"
              />
            </div>

            {/* Button Link */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Button Link
              </label>

              <input
                type="text"
                name="buttonLink"
                value={form.buttonLink}
                onChange={handleChange}
                placeholder="/products"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-slate-500"
              />
            </div>

            {/* Order */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Display Order
              </label>

              <input
                type="number"
                min={0}
                name="order"
                value={form.order}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-slate-500"
              />
            </div>

            {/* Active */}

            <label className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="h-5 w-5 accent-slate-900"
              />

              <span className="font-medium text-gray-700">
                Active Carousel
              </span>
            </label>
          </div>

          {/* =====================================================
                RIGHT SIDE
          ===================================================== */}

          <div className="space-y-5">
            <label className="flex h-80 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 transition hover:border-slate-900 hover:bg-gray-50">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <>
                  <FiImage className="mb-4 text-6xl text-gray-400" />

                  <p className="font-semibold text-slate-800">
                    Upload Carousel Image
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    JPG • PNG • WEBP
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating || updating}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                <FiSave />

                {editing ? "Update Carousel" : "Create Carousel"}
              </button>

              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-medium transition hover:bg-gray-100"
                >
                  <FiX />

                  Cancel
                </button>
              )}
            </div>
          </div>

            </form>
          </div>

      {/* =====================================================
            CAROUSEL LIST
      ===================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Uploaded Carousels
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Total : {carousels.length} Carousel(s)
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : carousels.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center">
            <FiImage className="mb-3 text-6xl text-gray-300" />

            <p className="font-semibold text-gray-600">
              No Carousel Found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-600">
                    Image
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-600">
                    Title
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase text-gray-600">
                    Order
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase text-gray-600">
                    Status
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {carousels.map((item) => (
                  <tr
                    key={item._id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <img
                        src={item.image.url}
                        alt={item.title}
                        className="h-20 w-36 rounded-xl border object-cover"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <h3 className="font-semibold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                        {item.subtitle}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-center font-semibold">
                      {item.order}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditing(item)}
                          className="rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          onClick={async () => {
                            if (
                              !window.confirm(
                                "Delete this carousel?"
                              )
                            )
                              return;

                            try {
                              await deleteCarousel(item._id).unwrap();

                              toast.success(
                                "Carousel deleted successfully"
                              );

                              if (
                                editing &&
                                editing._id === item._id
                              ) {
                                resetForm();
                              }
                            } catch (error) {
                              toast.error(
                                error?.data?.message ||
                                  "Delete failed"
                              );
                            }
                          }}
                          className="rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
    

export default Dashboard;
