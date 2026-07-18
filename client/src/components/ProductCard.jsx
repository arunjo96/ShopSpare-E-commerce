
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { toast } from "react-hot-toast";

import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,
} from "../services/wishlist/wishlistApi";

import { useAddToCartMutation } from "../services/cart/cartApi";

import { useDispatch, useSelector } from "react-redux";
import { openLoginModal } from "../store/uiSlice";

const ProductCard = ({ product }) => {
  const { _id, title, price, discountPrice, images, averageRating, stock } =
    product;

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

    const [addToCart] = useAddToCartMutation();

  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !user,
  });

  const wishlistItems = wishlistData?.wishlist?.items || [];

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const isWishlisted = wishlistItems.some((item) => item.product?._id === _id);

const handleAddToCart = async () => {
  try {
    const response = await addToCart({
      productId: product._id,
      quantity: 1,
    }).unwrap();

    toast.success(response?.message || "Product added to cart");
  } catch (error) {
    toast.error(error?.data?.message || "Failed to add to cart");
  }
};


  const handleWishlist = async () => {
    if (!user) {
      dispatch(openLoginModal());
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(_id).unwrap();

        toast.success("Removed from wishlist");
      } else {
        await addToWishlist({
          productId: _id,
        }).unwrap();

        toast.success("Added to wishlist ❤️");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Wishlist update failed");
    }
  };

  return (
    <div
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-sm
        transition
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <Link to={`/products/${_id}`}>
          <img
            src={
              images?.length
                ? images[0].url
                : "https://placehold.co/400x400?text=No+Image"
            }
            alt={title}
            className="
              h-60
              w-full
              object-cover
              transition
              duration-300
              group-hover:scale-105
            "
          />
        </Link>

        {/* Stock Top Right */}
        <span
          className={`
            absolute
            right-3
            top-3
            rounded-full
            px-3
            py-1
            text-xs
            font-semibold

            ${
              stock > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          `}
        >
          {stock > 0 ? `${stock} Stock` : "Out of Stock"}
        </span>

        {/* Discount */}
        {discountPrice > 0 && (
          <span
            className="
              absolute
              left-3
              top-3
              rounded-full
              bg-black
              px-3
              py-1
              text-xs
              font-semibold
              text-white
            "
          >
            Sale
          </span>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        <Link to={`/products/${_id}`}>
          <h3
            className="
              line-clamp-2
              text-lg
              font-semibold
              text-gray-900
              transition
              group-hover:text-gray-600
              capitalize
              pb-4
            "
          >
            {title}
          </h3>
        </Link>

        {/* Rating */}
        {/* <div className="flex items-center gap-2 text-sm">
          <span className="text-yellow-500">
            ⭐ {averageRating?.toFixed?.(1) || 0}
          </span>

          <span className="text-gray-400">|</span>

          <span className="text-gray-500">
            {stock > 0 ? "Available" : "Unavailable"}
          </span>
        </div> */}

        {/* Price */}
        <div className="flex items-center gap-3">
          {discountPrice > 0 ? (
            <>
              <span className="text-xl font-bold">
                ₹{discountPrice.toLocaleString("en-IN")}
              </span>

              <span
                className="
                    text-sm
                    text-gray-400
                    line-through
                  "
              >
                ₹{price.toLocaleString("en-IN")}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold">
              ₹{price.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          {/* View Product */}
          <Link
            to={`/products/${_id}`}
            className="
              flex-1
              rounded-xl
              bg-slate-900
              py-3
              text-center
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-slate-700
            "
          >
            View Product
          </Link>

          {/* Cart */}
          <button
            disabled={stock <= 0}
            onClick={handleAddToCart}
            className={`
              flex
              w-12
              items-center
              justify-center
              rounded-xl

              ${
                stock > 0
                  ? "bg-gray-100 hover:bg-black hover:text-white"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              }

              transition
            `}
            title="Add to Cart"
          >
            <FiShoppingCart size={20} />
          </button>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="
              flex
              w-12
              items-center
              justify-center
              rounded-xl
              bg-gray-100
              transition
              hover:bg-gray-200
            "
            title="Wishlist"
          >
            <FiHeart
              size={20}
              className={
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"
              }
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;