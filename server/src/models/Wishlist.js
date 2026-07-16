import {Schema, model} from "mongoose";

const wishlistItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    _id: false,
  },
);

const wishlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [wishlistItemSchema],
  },
  {
    timestamps: true,
  },
);

const Wishlist = model("Wishlist", wishlistSchema);

export default Wishlist;

