import { Button, Drawer, Menu, Popover, Tag } from "antd";
import React, { useState } from "react";
import { camelCaseToLabels, capitalizeKeys } from "~/helpers/stringHelpers";
import {
  MenuUnfoldOutlined,
  SlidersOutlined,
  FilterOutlined,
  BuildOutlined,
} from "@ant-design/icons";

import { type IFilters, useFiltersStore } from "~/stores/categoryStore";
import { type ValueOf } from "next/dist/shared/lib/constants";
import {
  getCategoriesKeyLabelWithAll,
  getProducersKeyLabel,
} from "~/helpers/selectsHelpers";
import PriceRangeFilter from "./PriceRangeFilter";
import { type Category, type Producer } from "@prisma/client";
import { isMobile } from "~/helpers/cssHelpers";

const getIconForFilter = (key: keyof IFilters) => {
  switch (key) {
    case "category":
      return <MenuUnfoldOutlined />;
    case "priceRange":
      return <SlidersOutlined />;
    case "producer":
      return <BuildOutlined />;
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { filters, setFilters, setCategory, setProducer } = useFiltersStore(
    (state) => state
  );

  return (
    <>
      <div className="sticky top-0 left-0 z-10 mb-5 flex flex-wrap gap-3 py-5 pl-9 backdrop-blur">
        <Button
          size="large"
          icon={<FilterOutlined />}
          onClick={() => setIsFilterOpen(true)}
        />
        {Object.entries(filters).map(([key, val]) => {
          const k = key as keyof IFilters;
          const v = val as ValueOf<IFilters>;
          if (!v) {
            return null;
          }
          return (
            <Tag
              className="flex h-10 items-center text-base font-light"
              icon={getIconForFilter(k)}
              // color="blue"
              closable={k !== "category"}
              key={k}
              onClose={() => void setFilters(k, null)}
            >
              {camelCaseToLabels(k) +
                ": " +
                capitalizeKeys(getFilterValue(k, v))}
            </Tag>
          );
        })}
      </div>
      <Drawer
        title="Filters"
        onClose={() => setIsFilterOpen(false)}
        placement="left"
        open={isFilterOpen}
      >
        <Menu
          onSelect={({ key, keyPath }) => {
            if (keyPath.length === 2) {
              if (keyPath[1] === "categories") {
                setCategory(key as Category);
              }
              if (keyPath[1] === "producers") {
                setProducer(key as Producer);
              }
            }
          }}
          mode="vertical"
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.SubMenu
            title="Categories"
            key="categories"
            icon={<MenuUnfoldOutlined />}
          >
            {getCategoriesKeyLabelWithAll().map(({ key, label }) => (
              <Menu.Item key={key}>{label}</Menu.Item>
            ))}
          </Menu.SubMenu>
          <Menu.SubMenu
            title="Producers"
            key="producers"
            icon={<BuildOutlined />}
          >
            {getProducersKeyLabel().map(({ key, label }) => (
              <Menu.Item key={key}>{label}</Menu.Item>
            ))}
          </Menu.SubMenu>
          <Popover
            arrow={false}
            placement={isMobile() ? "bottomLeft" : "rightTop"}
            content={<PriceRangeFilter />}
          >
            <Menu.Item icon={<SlidersOutlined />}>Price Range</Menu.Item>
          </Popover>
        </Menu>
      </Drawer>
    </>
  );
};

export default Filters;
