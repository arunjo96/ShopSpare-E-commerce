

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { logout, setCredentials } from "../store/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,

  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  
  if (
    result.error?.status === 401 &&
    !args.url?.includes("/auth/refresh-token")
  ) {
    const accessToken = api.getState().auth.accessToken;

    // User login pannala na refresh panna vendam
    if (!accessToken) {
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      api.dispatch(
        setCredentials({
          user: refreshResult.data.user,
          accessToken: refreshResult.data.accessToken,
        }),
      );

      // Original request retry
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh fail aana logout
      api.dispatch(logout());
    }
  }

  return result;
};

const baseApi = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithReauth,

 tagTypes: [
  "Auth",
  "Product",
  "Category",
  "Brand",
  "Cart",
  "Wishlist",
  "Order",
  "AdminOrder",
  "Carousel",
  "AdminCarousel",
],

  endpoints: () => ({}),
});

export default baseApi;
