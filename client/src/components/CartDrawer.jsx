

import { Link } from "react-router-dom";
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { toast } from "react-hot-toast";

import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from "../services/cart/cartApi";

const CartDrawer = ({ isOpen, onClose }) => {
  const { data, isLoading } = useGetCartQuery(undefined, {
    skip: !isOpen,
  });

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();

  const items = data?.cart?.items || [];
  const subtotal = data?.cart?.totalAmount || 0;

  const handleQuantity = async (productId, currentQty, change) => {
    const newQty = currentQty + change;

    if (newQty < 1) return;

    try {
      await updateCartItem({
        productId,
        quantity: newQty,
      }).unwrap();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update cart");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeCartItem(productId).unwrap();
      toast.success("Product removed from cart");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to remove item");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden ${
        isOpen ? "" : "pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          absolute inset-0 
          bg-black/40 
          backdrop-blur-sm
          transition-opacity
          duration-300
          ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      {/* Drawer */}
      <div
        className={`
          absolute
          right-0
          top-0
          h-full
          w-full
          max-w-lg
          bg-white
          shadow-2xl
          transition-transform
          duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold">Shopping Cart</h2>

            <p className="text-sm text-gray-500">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              rounded-full
              p-2
              transition
              hover:bg-gray-100
            "
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex h-[calc(100vh-250px)] flex-col overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-gray-500">Loading cart...</p>
            </div>
          ) : items.length === 0 ? (
            <div
              className="
              flex
              flex-1
              flex-col
              items-center
              justify-center
              gap-4
              px-6
              text-center
            "
            >
              <div
                className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-gray-100
              "
              >
                <FiShoppingBag size={35} className="text-gray-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">Your cart is empty</h3>

                <p className="mt-1 text-sm text-gray-500">
                  Add products to see them here
                </p>
              </div>

              <button
                onClick={onClose}
                className="
                  rounded-xl
                  bg-black
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-gray-800
                "
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item) => {
                const product = item.product;

                return (
                  <div
                    key={product._id}
                    className="
                      flex
                      gap-4
                      p-5
                      transition
                      border-gray-300
                      hover:bg-gray-50
                    "
                  >
                    {/* Image */}
                    <img
                      src={
                        product.images?.length
                          ? product.images[0].url
                          : "https://placehold.co/100x100"
                      }
                      alt={product.title}
                      className="
                        h-24
                        w-24
                        rounded-2xl
                        border
                        border-gray-300
                        object-cover
                      "
                    />

                    <div className="flex flex-1 flex-col">
                      <Link
                        to={`/products/${product._id}`}
                        onClick={onClose}
                        className="
                          line-clamp-2
                          text-sm
                          font-semibold
                          hover:underline
                          capitalize
                        "
                      >
                        {product.title}
                      </Link>

                      <p className="mt-2 font-bold">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>

                      <div
                        className="
                        mt-auto
                        flex
                        items-center
                        justify-between
                        pt-4
                      "
                      >
                        {/* Quantity */}
                        <div
                          className="
                          flex
                          items-center
                          rounded-xl
                          border
                          border-gray-300
                          bg-gray-50
                        "
                        >
                          <button
                            onClick={() =>
                              handleQuantity(product._id, item.quantity, -1)
                            }
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              hover:bg-white
                              hover: rounded-l-xl
                            "
                          >
                            <FiMinus size={14} />
                          </button>

                          <span
                            className="
                            w-8
                            text-center
                            text-sm
                            font-semibold
                          "
                          >
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleQuantity(product._id, item.quantity, 1)
                            }
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              hover:bg-white
                              hover: rounded-r-xl
                            "
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => handleRemove(product._id)}
                          className="
                            flex
                            items-center
                            gap-1
                            text-sm
                            text-red-500
                            hover:text-red-600
                            hover:underline
                          "
                        >
                          <FiTrash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="
              space-y-4
              border-t
              bg-white
              border-gray-300
              p-6
              shadow-[0_-8px_20px_rgba(0,0,0,0.06)]
            "
          >
            <div
              className="
              flex
              items-center
              justify-between
            "
            >
              <span className="text-gray-600">Subtotal</span>

              <span className="text-xl font-bold">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <Link
              to="/checkout"
              onClick={onClose}
              className="
                block
                rounded-2xl
                bg-black
                py-4
                text-center
                font-semibold
                text-white
                transition
                hover:bg-gray-800
              "
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;