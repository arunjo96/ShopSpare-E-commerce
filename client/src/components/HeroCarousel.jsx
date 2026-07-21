
import { Link } from "react-router-dom";
import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useGetCarouselsQuery } from "../services/carousel/carouselApi";

const HeroCarousel = () => {
  const { data, isLoading } = useGetCarouselsQuery();

  const carousels = data?.carousels || [];

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  /* ===========================
      Loading
  ============================ */

  if (isLoading) {
    return (
      <section className="flex h-[420px] items-center justify-center bg-gray-100 sm:h-[500px] lg:h-[650px]">
        <p className="text-lg font-medium text-gray-500">Loading Carousel...</p>
      </section>
    );
  }

  /* ===========================
      Empty
  ============================ */

  if (!carousels.length) {
    return (
      <section className="flex h-[420px] items-center justify-center bg-gray-100 sm:h-[500px] lg:h-[650px]">
        <p className="text-lg text-gray-500">No carousel available</p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        loop={carousels.length > 1}
        speed={800}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        className="
          h-[420px]
          sm:h-[500px]
          lg:h-[650px]
          xl:h-[750px]
        "
      >
        {carousels.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div className="relative h-full">
              {/* Background Image */}

              <img
                src={slide.image.url}
                alt={slide.title}
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  object-center
                "
              />

              {/* Overlay */}

              <div
                className="
                  absolute
                  inset-0
                  bg-black/45
                "
              />

              {/* Content */}

              <div
                className="
                  relative
                  z-10
                  mx-auto
                  flex
                  h-full
                  max-w-7xl
                  items-center
                  px-5
                  sm:px-8
                  lg:px-12
                "
              >
                <div
                  className="
                    max-w-2xl
                    text-center
                    text-white
                    sm:text-left
                  "
                >
                  <h1
                    className="
                      mb-4
                      text-3xl
                      font-bold
                      leading-tight
                      sm:text-5xl
                      lg:text-6xl
                    "
                  >
                    {slide.title}
                  </h1>

                  {slide.subtitle && (
                    <p
                      className="
                        mb-6
                        text-base
                        leading-7
                        text-gray-200
                        sm:text-lg
                        sm:leading-8
                      "
                    >
                      {slide.subtitle}
                    </p>
                  )}

                  {slide.buttonText?.trim() && slide.buttonLink?.trim() && (
                    <Link
                      to={slide.buttonLink}
                      className="
                        inline-flex
                        rounded-xl
                        bg-white
                        px-6
                        py-3
                        text-sm
                        font-semibold
                        text-slate-900
                        transition-all
                        duration-300
                        hover:bg-slate-900
                        hover:text-white
                        sm:px-8
                        sm:py-4
                        sm:text-base
                        
                      "
                    >
                      {slide.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Previous Button */}

      {carousels.length > 1 && (
        <button
          ref={prevRef}
          className="
    hidden
    sm:flex
    absolute
    left-6
    top-1/2
    z-20
    h-14
    w-14
    -translate-y-1/2
    items-center
    justify-center
    rounded-full
    bg-white/90
    text-slate-900
    shadow-xl
    transition-all
    duration-300
    hover:scale-110
    hover:bg-slate-900
    hover:text-white
  "
        >
          <FiChevronLeft size={28} />
        </button>
      )}

      {/* Next Button */}

      {carousels.length > 1 && (
        <button
          ref={nextRef}
          className="
    hidden
    sm:flex
    absolute
    right-6
    top-1/2
    z-20
    h-14
    w-14
    -translate-y-1/2
    items-center
    justify-center
    rounded-full
    bg-white/90
    text-slate-900
    shadow-xl
    transition-all
    duration-300
    hover:scale-110
    hover:bg-slate-900
    hover:text-white
  "
        >
          <FiChevronRight size={28} />
        </button>
      )}
    </section>
  );
};

export default HeroCarousel;