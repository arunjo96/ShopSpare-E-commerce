

import ProductCard from "../../components/ProductCard";
import { useGetProductsQuery } from "../../services/product/productApi";

const Home = () => {
  const { data, isLoading, isError } = useGetProductsQuery();

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
    <div className="mx-auto  px-4 py-8">
      {/* Hero */}
      <div className="mb-10 rounded-lg bg-slate-900 px-8 py-16 text-center text-white">
        <h1 className="mb-4 text-4xl font-bold">Welcome to ShopSphere</h1>

        <p className="text-lg text-slate-300">
          Discover the latest products at the best prices.
        </p>
      </div>

      {/* Latest Products */}
      <div className="max-w-9/10 mx-auto">
        <h2 className="mb-6 text-2xl font-bold">Latest Products</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;