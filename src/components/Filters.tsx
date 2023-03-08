import { Tag } from "antd";
import React from "react";
import { capitalizeKeys } from "~/helpers/stringHelpers";
import { MenuUnfoldOutlined } from "@ant-design/icons";

import { type IFilters, useFiltersStore } from "~/stores/categoryStore";

const getIconForFilter = (key: keyof IFilters) => {
  switch (key) {
    case "category":
      return <MenuUnfoldOutlined />;
    default:
      break;
  }
};

const Filters = () => {
  const filters = useFiltersStore((state) => state.filters);
  return (
    <div className="mb-5">
      {Object.entries(filters).map(([k, v]) => (
        <Tag
          className="[&_.anticon]:inline-flex"
          icon={getIconForFilter(k as keyof IFilters)}
          color="blue"
          key={k}
        >
          {capitalizeKeys(k) + ": " + capitalizeKeys(v as string)}
        </Tag>
      ))}
    </div>
  );
};

export default Filters;
