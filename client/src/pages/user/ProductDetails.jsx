
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiShoppingCart,
  FiHeart,
  FiTruck,
  FiRefreshCw,
  FiMinus,
  FiPlus,
  FiStar,
} from "react-icons/fi";

import {
  useGetSingleProductQuery,
} from "../../services/product/productApi";

import {
  useAddToCartMutation,
} from "../../services/cart/cartApi";

import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,
} from "../../services/wishlist/wishlistApi";

import { useDispatch, useSelector } from "react-redux";
import { openLoginModal } from "../../store/uiSlice";

const ProductDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetSingleProductQuery(id);

  const [addToCart] = useAddToCartMutation();

  const [addToWishlist] = useAddToWishlistMutation();

  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !user,
  });

  const product = data?.product;

  const wishlistItems = wishlistData?.wishlist?.items || [];

  const isWishlisted = wishlistItems.some(
    (item) => item.product?._id === product?._id,
  );

  const [selectedImage, setSelectedImage] = useState(0);

  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <h2 className="text-xl font-semibold text-red-500">
          Product not found
        </h2>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!user) {
      dispatch(openLoginModal());
      return;
    }

    try {
      const response = await addToCart({
        productId: product._id,
        quantity,
      }).unwrap();

      toast.success(response?.message || "Added to cart");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add cart");
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      dispatch(openLoginModal());
      return;
    }

    navigate("/checkout", {
      state: {
        buyNow: true,
        product,
        quantity,
      },
    });
  };

  const handleWishlist = async () => {
    if (!user) {
      dispatch(openLoginModal());
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id).unwrap();

        toast.success("Removed from wishlist");
      } else {
        await addToWishlist({
          productId: product._id,
        }).unwrap();

        toast.success("Added to wishlist ❤️");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Wishlist update failed");
    }
  };

  const currentPrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;

  const savedAmount = product.price - currentPrice;

  return (
    <section className="mx-auto max-w-9/10 px-4 py-10">
      <div className="grid gap-8 lg:gap-12 md:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-gray-300 bg-white">
            {product.discountPrice > 0 && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                Sale
              </span>
            )}

            <span
              className={`absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-semibold ${
                product.stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.stock > 0
                ? `Only ${product.stock} items left`
                : "Out of Stock"}
            </span>

            <img
              src={
                product.images?.length
                  ? product.images[selectedImage].url
                  : "https://placehold.co/600x600?text=No+Image"
              }
              alt={product.title}
              className="h-[520px]  w-full object-cover transition duration-300 hover:scale-105"
            />
          </div>

          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-xl border-2 ${
                    selectedImage === index ? "border-black" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image.url}
                    alt=""
                    className="h-20 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-4xl capitalize font-bold text-gray-900">
              {product.title}
            </h1>

            <p className="mt-3 leading-7 text-gray-600">
              {product.description}
            </p>
          </div>

          {/* Rating */}
          {/* <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">
              <FiStar className="fill-yellow-500 text-yellow-500" />
              <span className="font-medium">
                {product.averageRating?.toFixed?.(1) || 0}
              </span>
            </div>

            <span className="text-gray-500 font-medium">
              {product.stock > 0 ? (
                <>
                  Available Stock: <strong>{product.stock}</strong>
                </>
              ) : (
                "Out of Stock"
              )}
            </span>
          </div> */}

          {/* Price */}
          <div className="rounded-2xl bg-gray-100 border border-gray-300 bg-gray-50 p-5">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-gray-900">
                ₹{currentPrice.toLocaleString("en-IN")}
              </span>

              {product.discountPrice > 0 && (
                <span className="text-2xl text-gray-400 line-through">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {savedAmount > 0 && (
              <p className="mt-2 font-medium text-green-600">
                You Save ₹{savedAmount.toLocaleString("en-IN")}
              </p>
            )}
          </div>

          {/* Product Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-4 border-gray-300 bg-gray-100">
              <p className="text-sm text-gray-500">Category</p>

              <p className="mt-1 font-semibold">{product.category?.name}</p>
            </div>

            <div className="rounded-xl border p-4 border-gray-300 bg-gray-100">
              <p className="text-sm text-gray-500">Brand</p>

              <p className="mt-1 capitalize font-semibold">
                {product.brand?.name || "-"}
              </p>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <p className="mb-3 font-semibold">Quantity</p>

            <div className="flex w-fit  border-gray-300 items-center rounded-xl border">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-4 py-3 transition hover:bg-gray-100 hover:rounded-l-xl"
              >
                <FiMinus />
              </button>

              <span className="w-14 text-center font-semibold">{quantity}</span>

              <button
                onClick={() =>
                  setQuantity((prev) => Math.min(product.stock, prev + 1))
                }
                className="px-4 py-3 transition hover:bg-gray-100 hover:rounded-r-xl"
              >
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-slate-900
                py-4
                font-semibold
                text-white
                transition
                hover:bg-slate-800
                disabled:cursor-not-allowed
                disabled:bg-gray-300
              "
            >
              <FiShoppingCart size={20} />
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="
    flex
    flex-1
    items-center
    justify-center
    rounded-xl
    bg-orange-500
    py-4
    font-semibold
    text-white
    transition
    hover:bg-orange-600
    disabled:cursor-not-allowed
    disabled:bg-gray-300
  "
            >
              Buy Now
            </button>

            <button
              onClick={handleWishlist}
              className={`
    flex
    h-14
    w-14
    items-center
    justify-center
    rounded-xl
    border
    transition
    duration-300
    ${
      isWishlisted
        ? "bg-red-500 border-red-500 hover:bg-red-600"
        : "border-gray-300 hover:bg-gray-100"
    }
  `}
            >
              <FiHeart
                size={22}
                className={
                  isWishlisted ? "fill-white text-white" : "text-gray-700"
                }
              />
            </button>
          </div>

          {/* Delivery Info */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center border-gray-300 gap-3 rounded-xl border p-4">
              <div className="rounded-full bg-green-100 p-3">
                <FiTruck className="text-green-600" />
              </div>

              <div>
                <p className="font-semibold">Free Delivery</p>

                <p className="text-sm text-gray-500">
                  Delivery within 3-5 business days.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-gray-300 rounded-xl border p-4">
              <div className="rounded-full bg-blue-100 p-3">
                <FiRefreshCw className="text-blue-600" />
              </div>

              <div>
                <p className="font-semibold">Easy Returns</p>

                <p className="text-sm text-gray-500">
                  7 Days Replacement Available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;