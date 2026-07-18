
import { useSearchParams } from "react-router-dom";

import ProductCard from "../../components/ProductCard";

import { useGetCategoriesQuery } from "../../services/category/categoryApi";
import { useGetBrandsQuery } from "../../services/brand/brandApi";
import { useGetProductsQuery } from "../../services/product/productApi";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ===========================
      Read Filters From URL
  =========================== */

  const filters = {
    search: searchParams.get("search") || "",
    category: searchParams.getAll("category"),
    brand: searchParams.getAll("brand"),
    sort: searchParams.get("sort") || "",
    page: Number(searchParams.get("page")) || 1,
    limit: 10,
  };

  const { data: categoryData } = useGetCategoriesQuery();
  const { data: brandData } = useGetBrandsQuery();

  const { data, isLoading, isError } = useGetProductsQuery(filters);

  /* ===========================
      Update URL Helper
  =========================== */

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      params.delete(key);

      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, item));
      } else if (value !== "" && value !== null && value !== undefined) {
        params.set(key, value);
      }
    });

    if (!params.get("search")) {
      params.delete("search");
    }

    if (!params.get("sort")) {
      params.delete("sort");
    }

    if (!params.get("page") || params.get("page") === "1") {
      params.delete("page");
    }

    setSearchParams(params);
  };

  /* ===========================
      Category
  =========================== */

  const handleCategory = (slug) => {
    const categories = filters.category.includes(slug)
      ? filters.category.filter((item) => item !== slug)
      : [...filters.category, slug];

    updateParams({
      category: categories,
      page: 1,
    });
  };

  /* ===========================
      Brand
  =========================== */

  const handleBrand = (slug) => {
    const brands = filters.brand.includes(slug)
      ? filters.brand.filter((item) => item !== slug)
      : [...filters.brand, slug];

    updateParams({
      brand: brands,
      page: 1,
    });
  };

  /* ===========================
      Search
  =========================== */

  const handleChange = (e) => {
    updateParams({
      search: e.target.value,
      page: 1,
    });
  };

  /* ===========================
      Sort
  =========================== */

  const handleSort = (e) => {
    updateParams({
      sort: e.target.value,
      page: 1,
    });
  };

  if (isLoading) {
    return <div className="flex justify-center py-20">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="flex justify-center py-20 text-red-500">
        Failed to load products
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto flex  flex-col gap-6 px-4 sm:px-6 md:flex-row lg:px-8">
        <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:w-72 xl:w-80 flex-shrink-0">
          <h2 className="mb-6 text-xl font-bold">Filters</h2>

          <div className="border-b pb-5">
            <h3 className="mb-4 font-semibold">Category</h3>

            <div className="space-y-2 overflow-y-auto max-h-[350px]">
              {categoryData?.categories?.map((category) => (
                <label
                  key={category._id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.category.includes(category.slug)}
                    onChange={() => handleCategory(category.slug)}
                    className="h-4 w-4 accent-black"
                  />

                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-5">
            <h3 className="mb-4 font-semibold">Brand</h3>

            <div className="space-y-2 overflow-y-auto max-h-[350px]">
              {brandData?.brands?.map((brand) => (
                <label
                  key={brand._id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.brand.includes(brand.slug)}
                    onChange={() => handleBrand(brand.slug)}
                    className="h-4 w-4 accent-black"
                  />

                  <span>{brand.name}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  All Products
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  {data?.products?.length || 0} Products Available
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-gray-100 px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-black sm:w-72"
                />

                <select
                  value={filters.sort}
                  onChange={handleSort}
                  className="rounded-xl cursor-pointer bg-gray-100 px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-black"
                >
                  <option value="">Sort By</option>
                  <option value="priceLow">Price Low → High</option>
                  <option value="priceHigh">Price High → Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.products?.length > 0 ? (
              data.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full flex min-h-[350px] flex-col items-center justify-center rounded-2xl bg-white shadow-sm">
                <div className="mb-4 text-6xl">🔍</div>

                <h2 className="text-2xl font-semibold">No Products Found</h2>

                <p className="mt-2 px-3 text-gray-500">
                  Try another search or clear the filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;