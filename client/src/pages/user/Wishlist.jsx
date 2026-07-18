
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiHeart,
  FiTrash2,
  FiShoppingBag,
  FiShoppingCart,
  FiEye,
} from "react-icons/fi";

import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../../services/wishlist/wishlistApi";

import { useAddToCartMutation } from "../../services/cart/cartApi";

const Wishlist = () => {
  const { data, isLoading } = useGetWishlistQuery();

  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const [addToCart] = useAddToCartMutation();

  const items = data?.wishlist?.items || [];

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({
        productId,
        quantity: 1,
      }).unwrap();

      toast.success("Added to cart");
    } catch (error) {
      toast.error(error?.data?.message || "Failed");
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id).unwrap();

      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(error?.data?.message || "Failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-gray-500 animate-pulse">Loading wishlist...</div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-9/10">
        {/* Header */}

        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-full bg-red-50 p-3">
            <FiHeart className="text-red-500" size={24} fill="currentColor" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>

            <p className="text-sm text-gray-500">{items.length} items saved</p>
          </div>
        </div>

        {/* Empty */}

        {items.length === 0 ? (
          <div
            className="
            flex
            min-h-[350px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            bg-white
            shadow-sm
          "
          >
            <FiShoppingBag size={60} className="mb-4 text-gray-300" />

            <h2 className="text-xl font-semibold">Your wishlist is empty</h2>

            <p className="mt-2 text-gray-500">
              Save products you love and find them here later.
            </p>

            <Link
              to="/products"
              className="
              mt-6
              rounded-xl
              bg-black
              px-6
              py-3
              text-white
              transition
              hover:bg-gray-800
              "
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div
            className="
            grid
            gap-6
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
          >
            {items.map((item) => {
              const product = item.product;

              return (
                <div
                  key={product._id}
                  className="
                  group
                  overflow-hidden
                  rounded-2xl
                  bg-white
                  shadow-sm
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-lg
                  "
                >
                  {/* Image */}

                  <div
                    className="
                    relative
                    overflow-hidden
                  "
                  >
                    <img
                      src={
                        product.images?.length
                          ? product.images[0].url
                          : "https://placehold.co/300"
                      }
                      alt={product.title}
                      className="
                      h-60
                      w-full
                      object-cover
                      transition
                      duration-500
                      group-hover:scale-105
                      "
                    />

                    <button
                      onClick={() => handleRemove(product._id)}
                      className="
                      absolute
                      right-3
                      top-3
                      rounded-full
                      bg-white
                      p-2
                      text-red-500
                      shadow
                      transition
                      hover:bg-red-500
                      hover:text-white
                      "
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>

                  {/* Content */}

                  <div className="p-4">
                    <h2
                      className="
                      line-clamp-2
                      text-base
                      font-semibold
                      text-gray-900
                    "
                    >
                      {product.title}
                    </h2>

                    <p
                      className="
                      mt-3
                      text-lg
                      font-bold
                    "
                    >
                      ₹{product.discountPrice || product.price}
                    </p>

                    <div className="mt-5 space-y-3">
                      {/* Add to Cart */}
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        className="
      flex
      w-full
      items-center
      justify-center
      gap-2
      rounded-xl
      bg-black
      py-3
      text-sm
      font-semibold
      text-white
      transition
      hover:bg-gray-800
    "
                      >
                        <FiShoppingCart size={18} />
                        Add to Cart
                      </button>

                      {/* View */}
                      <Link
                        to={`/products/${product._id}`}
                        className="
      flex
      items-center
      justify-center
      gap-2
      rounded-xl
      border
      border-gray-300
      py-2.5
      text-sm
      font-medium
      transition
      hover:bg-gray-100
    "
                      >
                        <FiEye size={17} />
                        View Product
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Wishlist;