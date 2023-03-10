import { Category, Producer } from "@prisma/client";
import { capitalizeKeys } from "./stringHelpers";

export const getCategoriesKeyLabel = () =>
  Object.keys(Category).map((cat) => ({
    key: cat,
    label: capitalizeKeys(cat),
  }));

export const getProducersKeyLabel = () =>
  Object.keys(Producer).map((cat) => ({
    key: cat,
    label: capitalizeKeys(cat),
  }));

export const getCategoriesKeyLabelWithAll = () => [
  { key: "all", label: "All" },
  ...getCategoriesKeyLabel(),
];
