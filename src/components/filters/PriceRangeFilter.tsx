import { Slider } from "antd";
import React from "react";
import { useFiltersStore } from "~/stores/categoryStore";

const PriceRangeFilter = () => {
  const setPriceRange = useFiltersStore((state) => state.setPriceRange);
  return (
    <div>
      PriceRangeFilter
      <Slider
        defaultValue={[0, 10000]}
        max={10000}
        range
        onAfterChange={(val) => setPriceRange(val)}
      />
    </div>
  );
};
export default PriceRangeFilter;
