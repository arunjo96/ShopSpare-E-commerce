import { FiShoppingCart } from "react-icons/fi";

const CartButton = ({ cartCount = 0, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative
        rounded-full
        p-2
        transition-all
        duration-200
        hover:bg-gray-100
        active:scale-95
        ${className}
      `}
    >
      <FiShoppingCart size={22} />

      {cartCount > 0 && (
        <span
          className="
            absolute
            -right-1
            -top-1
            flex
            h-5
            w-5
            items-center
            justify-center
            rounded-full
            bg-red-500
            text-[11px]
            font-semibold
            text-white
          "
        >
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </button>
  );
};

export default CartButton;
