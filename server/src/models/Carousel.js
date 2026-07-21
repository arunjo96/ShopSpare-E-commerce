import {Schema, model} from "mongoose";

const carouselSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    subtitle: {
      type: String,
      default: "",
      trim: true,
    },

    buttonText: {
      type: String,
      default: "",
      trim: true,
    },

    buttonLink: {
      type: String,
    //   default: "/products",
      trim: true,
    },

    image: {
      public_id: {
        type: String,
        required: true,
      },

      url: {
        type: String,
        required: true,
      },
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Carousel = model("Carousel", carouselSchema);

export default Carousel;
