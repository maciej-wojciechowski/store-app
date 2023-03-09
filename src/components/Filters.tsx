import { Tag } from "antd";
import React from "react";
import { camelCaseToLabels, capitalizeKeys } from "~/helpers/stringHelpers";
import { MenuUnfoldOutlined, SlidersOutlined } from "@ant-design/icons";

import { type IFilters, useFiltersStore } from "~/stores/categoryStore";
import { type ValueOf } from "next/dist/shared/lib/constants";

const getIconForFilter = (key: keyof IFilters) => {
  switch (key) {
    case "category":
      return <MenuUnfoldOutlined />;
    case "priceRange":
      return <SlidersOutlined />;
    default:
      break;
  }
};

const getFilterValue = (k: keyof IFilters, v: ValueOf<IFilters>): string => {
  if (!v) {
    return "";
  }
  if (k === "priceRange") {
    const priceRangeVal = v as NonNullable<IFilters["priceRange"]>;
    return priceRangeVal.join(" - ");
  }
  return v as string;
};

const Filters = () => {
  const { filters, setFilters } = useFiltersStore((state) => state);
  return (
    <div className="mb-5">
      {Object.entries(filters).map(([key, val]) => {
        const k = key as keyof IFilters;
        const v = val as ValueOf<IFilters>;
        if (!v) {
          return null;
        }
        return (
          <Tag
            className="[&_.anticon]:inline-flex"
            icon={getIconForFilter(k)}
            color="blue"
            closable={k !== "category"}
            key={k}
            onClose={() => void setFilters(k, null)}
          >
            {camelCaseToLabels(k) + ": " + capitalizeKeys(getFilterValue(k, v))}
          </Tag>
        );
      })}
    </div>
  );
};

export default Filters;
