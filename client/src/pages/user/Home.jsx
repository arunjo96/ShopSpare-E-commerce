
import { useNavigate } from "react-router-dom";
import HeroCarousel from "../../components/HeroCarousel";
import ProductCard from "../../components/ProductCard";
import { homeCategories, homeBrands } from "../../constants";

import { useGetProductsQuery } from "../../services/product/productApi";

const Home = () => {
  const { data, isLoading, isError } = useGetProductsQuery();

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h2 className="text-xl font-semibold text-red-500">
          Failed to load products.
        </h2>
      </div>
    );
  }

  return (
    <>
      {/* ================= Hero Carousel ================= */}

      <HeroCarousel />

      {/* ================= Categories ================= */}

      <section className="mx-auto max-w-9/10 px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Shop by Category
          </h2>

          <p className="mt-2 text-slate-500">
            Find the right spare parts by category.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center justify-center">
          {homeCategories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.name}
                onClick={() =>
                  navigate(
                    `/products?category=${encodeURIComponent(category.name)}`,
                  )
                }
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:bg-white hover:shadow-xl"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 transition-all duration-300 group-hover:bg-slate-900">
                  <Icon
                    size={30}
                    className="text-slate-700 transition-colors duration-300 group-hover:text-white"
                  />
                </div>

                <h3 className="mt-5 text-sm font-semibold text-slate-800">
                  {category.name}
                </h3>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= Popular Brands ================= */}

      <section className="mx-auto max-w-9/10 px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Shop by Brand</h2>

          <p className="mt-2 text-slate-500">
            Choose your vehicle brand to find compatible spare parts.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center justify-center">
          {homeBrands.map((brand) => {
            const Icon = brand.icon;

            return (
              <button
                key={brand.name}
                onClick={() =>
                  navigate(`/products?brand=${encodeURIComponent(brand.name)}`)
                }
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:bg-white hover:shadow-xl"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 transition-all duration-300 group-hover:bg-slate-900">
                  <Icon
                    size={30}
                    className="text-slate-700 transition-colors duration-300 group-hover:text-white"
                  />
                </div>

                <h3 className="mt-5 text-sm font-semibold text-slate-800">
                  {brand.name}
                </h3>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= Latest Products ================= */}

      <section className="mx-auto max-w-9/10 px-4 py-12">
        <div className="mb-8 flex items-end justify-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Latest Products
            </h2>

            <p className="mt-2 text-gray-500">Discover our newest arrivals.</p>
          </div>
        </div>

        {data?.products?.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center">
            <h3 className="text-xl font-semibold text-slate-700">
              No products found
            </h3>

            <p className="mt-2 text-gray-500">
              Products will appear here once added.
            </p>
          </div>
        )}
      </section>




    </>
  );
};

export default Home;