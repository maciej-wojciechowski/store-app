import { Category, Producer, Delivery } from "@prisma/client";
import { capitalizeKeys } from "./stringHelpers";
import { DELIVERY_COSTS } from "~/consts";
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

export const getDeliveryLabelsForSelect = () =>
  Object.keys(Delivery).map((del) => ({
    value: del,
    label: capitalizeKeys(del),
  }));

export const getDeliveryCostWithKey = (key: keyof typeof DELIVERY_COSTS) => {
  return { key, cost: DELIVERY_COSTS[key] };
};
