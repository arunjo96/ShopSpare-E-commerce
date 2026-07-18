

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setCredentials, logout } from "./store/authSlice";
import { useRefreshTokenMutation } from "./services/auth/authApi";

import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  const [refreshToken] = useRefreshTokenMutation();

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
      } catch (error) {
        dispatch(logout());
      }
    };

    restoreSession();
  }, []);

  return <AppRoutes />;
}

export default App;