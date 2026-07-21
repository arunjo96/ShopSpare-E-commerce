import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  console.log("AdminRoute:", {
    isAuthenticated,
    user,
  });

  if (isLoading) {
    return null;
  }

  // Login pannala
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin illa
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin
  return <Outlet />;
};

export default AdminRoute;
