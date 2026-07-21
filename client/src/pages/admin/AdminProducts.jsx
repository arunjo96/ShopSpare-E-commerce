
import { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiX,
  FiUploadCloud,
  FiImage,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import Swal from "sweetalert2";

import {
  useGetAdminProductsQuery,
  useDeleteProductMutation,
} from "../../services/admin/adminProductApi";

import ProductForm from "../../components/AdminProductForm";

const AdminProducts = () => {
  const { data, isLoading, refetch } = useGetAdminProductsQuery();

  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.products || [];

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase()),
  );

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Delete Product?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteProduct(id).unwrap();

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Product deleted successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Delete Failed",
      text: error?.data?.message || "Something went wrong.",
    });
  }
};

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>

          <p className="text-gray-500">Loading Products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="space-y-6">
        {/* Sticky Header */}

        <div className="lg:sticky pt-10 lg:pt-5 top-0 z-20 -mx-6 -mt-6 mb-8 border-gray-300 border-b bg-gray-100/95 px-6 py-5 backdrop-blur">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Products</h1>

              <p className="mt-1 text-gray-500">
                Manage all your products in one place.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedProduct(null);
                setShowForm(true);
              }}
              className="flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-slate-800 active:scale-95"
            >
              <FiPlus size={18} />
              Add Product
            </button>
          </div>

          {/* Search */}

          <div
            className="
                      flex
                      flex-col
                      gap-3
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      pt-5
                      pb-2
                      "
          >
            <div className="relative w-full max-w-lg">
              <FiSearch
                className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-gray-400
                          "
              />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                          w-full
                          rounded-xl
                          border
                          border-gray-300
                          bg-white
                          py-3
                          pl-11
                          pr-11
                          shadow-sm
                          outline-none
                          transition
                          focus:border-gray-400
                          "
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="
                              absolute
                              right-4
                              top-1/2
                              -translate-y-1/2
                              text-gray-400
                              hover:text-black
                              "
                >
                  <FiX />
                </button>
              )}
            </div>

            <p className="text-sm text-gray-500">
              Showing
              <span className="mx-1 font-semibold text-gray-700">
                {filteredProducts.length}
              </span>
              brands
            </p>
          </div>
        </div>

        {/* Empty State */}

        {filteredProducts.length === 0 ? (
          <div className="flex min-h-[350px] lg:mt-15 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-center shadow-sm">
            <div className="text-6xl">📦</div>

            <h2 className="mt-4 text-xl font-semibold">No Products Found</h2>

            <p className="mt-2 text-gray-500">
              Try another search or add a new product.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 lg:mt-15">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden  rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Product Image */}

                {/* Product Image */}

                <div className="group relative overflow-hidden bg-gray-100">
                  <div className="aspect-[4/5] w-full">
                    <img
                      src={
                        product.images?.length
                          ? `${product.images[0].url}?t=${product.updatedAt}`
                          : "https://placehold.co/600x400"
                      }
                      alt={product.title}
                      className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110"
                    />
                  </div>

                  {/* Image Overlay */}

                  <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />

                  {/* Status Badges */}

                  <div className="absolute right-3 top-3 flex flex-col gap-2">
                    {product.isActive ? (
                      <span className="rounded-full bg-green-500/90 px-3 py-1 text-xs font-medium text-white shadow backdrop-blur">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-500/90 px-3 py-1 text-xs font-medium text-white shadow backdrop-blur">
                        Inactive
                      </span>
                    )}

                    {product.featured && (
                      <span className="rounded-full bg-yellow-400/90 px-3 py-1 text-xs font-medium text-black shadow backdrop-blur">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}

                <div className="space-y-4 p-5">
                  <div>
                    <h2 className="line-clamp-2 capitalize text-lg font-semibold text-slate-900">
                      {product.title}
                    </h2>

                    <p className="mt-1 capitalize text-sm text-gray-500">
                      {product.category?.name || "-"} •{" "}
                      {product.brand?.name || "-"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        Price
                      </p>

                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-green-600">
                          ₹{product.discountPrice || product.price}
                        </span>

                        {product.discountPrice > 0 && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        Stock
                      </p>

                      <p className="font-semibold">{product.stock}</p>
                    </div>
                  </div>
                  {/* Actions */}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowForm(true);
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-500 py-3 font-medium text-blue-600 transition-all duration-300 hover:bg-blue-50"
                    >
                      <FiEdit2 />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500 py-3 font-medium text-red-600 transition-all duration-300 hover:bg-red-50"
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Drawer */}
      {showForm && (
        <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-2xl overflow-y-auto bg-white shadow-2xl">
          {/* Header */}

          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-300 bg-white px-6 py-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedProduct ? "Edit Product" : "Add Product"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {selectedProduct
                  ? "Update product information"
                  : "Fill the details to create a new product"}
              </p>
            </div>

            <button
              onClick={() => {
                setShowForm(false);
                setSelectedProduct(null);
              }}
              className="rounded-lg p-2 transition hover:bg-gray-100"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Form */}

          <div className="p-6">
            <ProductForm
              key={selectedProduct?._id || "new-product"}
              product={selectedProduct}
              onClose={() => {
                setShowForm(false);
                setSelectedProduct(null);
                refetch();
              }}
            />
          </div>
        </div>
      )}

      {/* Overlay */}

      {showForm && (
        <div
          onClick={() => {
            setShowForm(false);
            setSelectedProduct(null);
          }}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
        />
      )}
    </>
  );
};

export default AdminProducts;