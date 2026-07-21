import baseApi from "../baseApi";

export const carouselApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCarousels: builder.query({
      query: () => "/carousels",

      providesTags: ["Carousel"],
    }),
  }),
});

export const { useGetCarouselsQuery } = carouselApi;

