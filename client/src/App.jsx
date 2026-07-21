

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { setCredentials, logout } from "./store/authSlice";
import { useRefreshTokenMutation } from "./services/auth/authApi";

import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  const [refreshToken] = useRefreshTokenMutation();

const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const restoreSession = async () => {
    try {
      const response = await refreshToken().unwrap();

      console.log(response);

      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.accessToken,
        })
      );
    } catch (error) {
      dispatch(logout());
    } finally {
      setIsLoading(false);
    }
  };

  restoreSession();
}, []);

if (isLoading) {
  return <div>Loading...</div>;
}

return <AppRoutes />;
}

export default App;