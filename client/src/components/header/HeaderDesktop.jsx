import { Link, useLocation, NavLink } from "react-router-dom";
import { FiHeart, FiUser, FiChevronDown } from "react-icons/fi";

import { navItems } from "../../constants/navItems";

import CartButton from "./CartButton";
import ProfileDropdown from "./ProfileDropdown";

const HeaderDesktop = ({
  user,
  isAuthenticated,
  cartCount,
  profileOpen,
  setProfileOpen,
  handleWishlistClick,
  handleCartClick,
  handleLogout,
}) => {


    const location = useLocation();


  return (
    <div className="hidden items-center gap-5 lg:flex">
      {/* Navigation */}

      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`relative py-2 transition-all duration-300 
    ${
      location.pathname + location.search === item.path
        ? "text-black font-semibold"
        : "text-gray-500 hover:text-black font-medium "
    }`}
        >
          {item.name}
        </Link>
      ))}

          {/* Right Actions */}
          
          <div className="flex items-center gap-4 ">

      <NavLink
        to="/wishlist"
        onClick={handleWishlistClick}
        className="rounded-full p-2 transition-all duration-200 hover:bg-gray-100"
      >
        <FiHeart size={21} />
      </NavLink>

      {/* Cart */}

      <CartButton cartCount={cartCount} onClick={handleCartClick} />

      {/* Profile */}

      {isAuthenticated ? (
        <div className="relative">
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="
              flex
              items-center
              gap-3
              rounded-full
              px-2
              py-2
              transition-all
              duration-200
              hover:bg-gray-100
              active:scale-95
            "
          >
            {/* Avatar */}

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-black
                text-sm
                font-bold
                text-white
              "
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>

            {/* User */}

            <div className="flex flex-col text-left">
              <span className="max-w-[120px] truncate text-sm font-semibold">
                {user?.name}
              </span>

              <span className="max-w-[120px] truncate text-xs text-gray-500">
                {user?.email}
              </span>
            </div>

            <FiChevronDown
              size={17}
              className={`transition-transform duration-200 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <ProfileDropdown
            user={user}
            profileOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
            onLogout={handleLogout}
          />
        </div>
      ) : (
        <NavLink
          to="/login"
          className="rounded-full p-2 transition-all duration-200 hover:bg-gray-100"
        >
          <FiUser size={22} />
        </NavLink>
      )}
      </div>

    </div>
  );
};

export default HeaderDesktop;
