import baseApi from "../baseApi";

export const adminCarouselApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ============= GET ADMIN CAROUSELS ===================== */

    getAdminCarousels: builder.query({
      query: () => "/carousels/admin/all",

      providesTags: ["AdminCarousel"],
    }),

    /* ============= CREATE ==================== */

    createCarousel: builder.mutation({
      query: (formData) => ({
        url: "/carousels",
        method: "POST",
        body: formData,
      }),

      invalidatesTags: ["AdminCarousel", "Carousel"],
    }),

    /* ==============  UPDATE =============== */

    updateCarousel: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/carousels/${id}`,
        method: "PUT",
        body: formData,
      }),

      invalidatesTags: ["AdminCarousel", "Carousel"],
    }),

    /* ========== DELETE ================== */

    deleteCarousel: builder.mutation({
      query: (id) => ({
        url: `/carousels/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["AdminCarousel", "Carousel"],
    }),
  }),
});

export const {
  useGetAdminCarouselsQuery,
  useCreateCarouselMutation,
  useUpdateCarouselMutation,
  useDeleteCarouselMutation,
} = adminCarouselApi;
