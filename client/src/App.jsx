

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { setCredentials, logout } from "./store/authSlice";
import { useRefreshTokenMutation } from "./services/auth/authApi";

import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const [refreshToken] = useRefreshTokenMutation();
const [loading, setLoading] = useState(true);
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await refreshToken().unwrap();

        dispatch(
          setCredentials({
            user: response.user,
            accessToken: response.accessToken,
          }),
        );
      } catch {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  },[]);

    if (loading) {
      return <div>Loading...</div>;
    }

  return <AppRoutes />;
}

export default App;