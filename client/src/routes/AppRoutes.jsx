import {  Routes, Route } from "react-router-dom";

import UserLayout from "../components/layouts/UserLayout";
import AdminLayout from "../components/layouts/AdminLayout";
import AuthLayout from "../components/layouts/AuthLayout";
import LoginModal from "../components/LoginModal";

/* Auth */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

/* User */
import Home from "../pages/user/Home";
import Products from "../pages/user/Products";
import ProductDetails from "../pages/user/ProductDetails";
// import Cart from "../pages/user/Cart";
import Wishlist from "../pages/user/Wishlist";
import Checkout from "../pages/user/Checkout";
import Orders from "../pages/user/Orders";
// import Profile from "../pages/user/Profile";

/* Admin */
import AdminRoute from "../components/AdminRoutes";
// import Dashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import Categories from "../pages/admin/Categories";
import Brands from "../pages/admin/Brands";
import AdminOrders from "../pages/admin/AdminOrders";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* ---------- User ---------- */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/products"
            element={
           
                <Products />
             
            }
          />

          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Route>
        {/* ---------- Auth ---------- */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>
        {/* ---------- Admin ---------- */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* <Route index element={<Dashboard />} /> */}
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<Categories />} />
            <Route path="brands" element={<Brands />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>
      </Routes>

      <LoginModal />
    </>
  );
};

export default AppRoutes;
