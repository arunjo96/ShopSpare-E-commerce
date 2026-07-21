import {
  FaShoePrints,
  FaChild,
  FaShoppingBag,
  FaFemale,
  FaMale,
  FaTag,
} from "react-icons/fa";

import { SiNike, SiPuma, SiAdidas, SiZara } from "react-icons/si";

import { GiClothes } from "react-icons/gi";

export const homeCategories = [
  {
    name: "Men",
    icon: FaMale,
  },
  {
    name: "Women",
    icon: FaFemale,
  },
  {
    name: "Kids",
    icon: FaChild,
  },
  {
    name: "Footwear",
    icon: FaShoePrints,
  },
  {
    name: "Accessories",
    icon: FaShoppingBag,
  },
];

export const homeBrands = [
  {
    name: "Nike",
    icon: SiNike,
  },
  {
    name: "Zara",
    icon: SiZara,
  },
  {
    name: "Puma",
    icon: SiPuma,
  },
  {
    name: "H&M",
    icon: GiClothes,
  },
  {
    name: "Adidas",
    icon: SiAdidas,
  },
  {
    name: "Levi's",
    icon: FaTag,
  },
];
