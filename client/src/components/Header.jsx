
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { openLoginModal } from "../store/uiSlice";
import { logout } from "../store/authSlice";
import baseApi from "../services/baseApi";
import { useLogoutMutation } from "../services/auth/authApi";
import { useGetCartQuery } from "../services/cart/cartApi";
import HeaderDesktop from "./header/HeaderDesktop";
import HeaderMobile from "./header/HeaderMobile";
import CartDrawer from "./CartDrawer";
const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const profileRef = useRef(null);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();
  const { data } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const cartCount = isAuthenticated ? data?.cart?.totalItems || 0 : 0;
  useEffect(() => {
    setProfileOpen(false);
    setIsOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const handleOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setIsOpen(false);
        setIsCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      setProfileOpen(false);
      setIsOpen(false);
      setIsCartOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleWishlistClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      dispatch(openLoginModal());
      return;
    }
    setProfileOpen(false);
  };
  const handleCartClick = () => {
    if (!isAuthenticated) {
      dispatch(openLoginModal());
      return;
    }
    setProfileOpen(false);
    setIsCartOpen(true);
  };
  return (
    <>
  
      <header className="sticky top-0 z-40 bg-white shadow-sm">
      
        <div className="mx-auto flex max-w-8xl items-center px-4 py-4 sm:px-6 lg:px-8 gap-[10px]">
          
          {/* Logo */}
          <div className="flex-1">
           
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight text-black"
            >
            
              ShopSphere
            </Link>
          </div>
          {/* Desktop */}
          <HeaderDesktop
            user={user}
            isAuthenticated={isAuthenticated}
            cartCount={cartCount}
            profileOpen={profileOpen}
            setProfileOpen={setProfileOpen}
            profileRef={profileRef}
            handleWishlistClick={handleWishlistClick}
            handleCartClick={handleCartClick}
            handleLogout={handleLogout}
          />
          {/* Mobile */}
          <HeaderMobile
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            user={user}
            isAuthenticated={isAuthenticated}
            cartCount={cartCount}
            handleWishlistClick={handleWishlistClick}
            handleCartClick={handleCartClick}
            handleLogout={handleLogout}
          />
        </div>
      </header>
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />{" "}
    </>
  );
};
export default Header;
