import baseApi from "../baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order", "Cart"],
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    getOrderById: builder.query({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    cancelOrder: builder.mutation({
      query: ({ orderId, reason }) => ({
        url: `/orders/cancel/${orderId}`,
        method: "PUT",
        body: {
          reason,
        },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
} = orderApi;
