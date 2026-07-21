import { NavLink } from "react-router-dom";
import { FiUser, FiPackage, FiHeart, FiLogOut } from "react-icons/fi";

const ProfileDropdown = ({ user, profileOpen, onClose, onLogout }) => {
  return (
    <div
      className={`
        absolute
        right-0
        top-full
        mt-3
        w-64
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-2xl
        transition-all
        duration-200
        ease-out
        origin-top-right
        ${
          profileOpen
            ? "visible translate-y-0 scale-100 opacity-100"
            : "pointer-events-none invisible -translate-y-2 scale-95 opacity-0"
        }
      `}
    >
      {/* User Info */}

      <div className="bg-gray-50 px-5 py-4">
        <p className="truncate text-sm font-semibold text-gray-900">
          {user?.name}
        </p>

        <p className="truncate text-xs text-gray-500">{user?.email}</p>
      </div>

      {/* Profile */}

      {/* <NavLink
        to="/profile"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3  font-semibold px-5 py-3 transition-all duration-200
          ${
            isActive
              ? "bg-gray-100 font-semibold"
              : "hover:bg-gray-100 hover:pl-6"
          }`
        }
      >
        <FiUser size={18} />
        <span>Profile</span>
      </NavLink> */}

      {/* Orders */}

      <NavLink
        to="/orders"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-5 py-3 font-semibold transition-all duration-200
          ${
            isActive
              ? "bg-gray-100 font-semibold"
              : "hover:bg-gray-100 hover:pl-6"
          }`
        }
      >
        <FiPackage size={18} />
        <span>Orders</span>
      </NavLink>

      {/* Wishlist */}

      <NavLink
        to="/wishlist"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-5 py-3 font-semibold transition-all duration-200
          ${
            isActive
              ? "bg-gray-100 font-semibold"
              : "hover:bg-gray-100 hover:pl-6"
          }`
        }
      >
        <FiHeart size={18} />
        <span>Wishlist</span>
      </NavLink>

      <div className="border-t border-gray-200" />

      {/* Logout */}

      <button
        onClick={onLogout}
        className="
          flex
          w-full
          items-center
          gap-3
          px-5
          py-3
          text-red-600
          transition-all
          duration-200
          hover:bg-red-50
          hover:pl-6
          font-semibold
        "
      >
        <FiLogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default ProfileDropdown;
