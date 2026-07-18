
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiHeart,
  FiUser,
  FiPackage,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { useState } from "react";

import CartButton from "./CartButton";
import { navItems } from "../../constants/navItems";

const HeaderMobile = ({
  isOpen,
  setIsOpen,
  user,
  isAuthenticated,
  cartCount,
  handleCartClick,
  handleWishlistClick,
  handleLogout,
}) => {
  const location = useLocation();
  const [productsOpen, setProductsOpen] = useState(false);

  const closeDrawer = () => {
    setIsOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
      isActive
        ? "bg-white text-black"
        : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      {/* Mobile Right */}
      {/* Mobile Right */}
      <div className="flex items-center gap-3 lg:hidden">
        <CartButton cartCount={cartCount} onClick={handleCartClick} />

        {!isAuthenticated && (
          <Link
            to="/login"
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <FiUser size={22} />
          </Link>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full p-2 transition hover:bg-gray-100"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* Drawer */}
      <nav
        className={`fixed left-0 top-0 z-50 h-screen w-[300px] max-w-[82vw] bg-slate-900 shadow-2xl transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 px-5 py-5">
          <Link
            to="/"
            onClick={closeDrawer}
            className="text-xl font-bold text-white"
          >
            ShopSphere
          </Link>

          <button
            onClick={closeDrawer}
            className="rounded-full p-2 text-white hover:bg-white/10"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* User */}
        {isAuthenticated && (
          <div className="border-b border-slate-700 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white font-bold text-black">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate font-semibold text-white">
                  {user?.name}
                </p>

                <p className="truncate text-sm text-gray-400">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-2 flex flex-col gap-2 px-3">
          <NavLink to="/" end onClick={closeDrawer} className={navLinkClass}>
            <FiHome size={20} />
            <span>Home</span>
          </NavLink>

          {/* Products */}
          <div className="overflow-hidden rounded-xl">
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 transition ${
                location.pathname === "/products"
                  ? "bg-white text-black"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <FiGrid size={20} />
                <span>Products</span>
              </div>

              <FiChevronDown
                className={`transition-transform duration-300 ${
                  productsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                productsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {navItems.slice(1).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/products"}
                  onClick={closeDrawer}
                  className={() =>
                    `ml-6 mt-1 flex rounded-lg px-4 py-2 text-sm transition ${
                      location.pathname + location.search === item.path
                        ? "bg-white font-semibold text-black"
                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          <NavLink
            to="/wishlist"
            onClick={(e) => {
              handleWishlistClick(e);

              if (isAuthenticated) {
                closeDrawer();
              }
            }}
            className={navLinkClass}
          >
            <FiHeart size={20} />
            <span>Wishlist</span>
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/orders"
                onClick={closeDrawer}
                className={navLinkClass}
              >
                <FiPackage size={20} />
                <span>Orders</span>
              </NavLink>

              <NavLink
                to="/profile"
                onClick={closeDrawer}
                className={navLinkClass}
              >
                <FiUser size={20} />
                <span>Profile</span>
              </NavLink>

              <button
                onClick={() => {
                  closeDrawer();
                  handleLogout();
                }}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
              >
                <FiLogOut size={20} />
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" onClick={closeDrawer} className={navLinkClass}>
              <FiUser size={20} />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </nav>
    </>
  );
};

export default HeaderMobile;