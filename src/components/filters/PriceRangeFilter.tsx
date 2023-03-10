import { Button, InputNumber, Slider } from "antd";
import React, { useEffect, useState } from "react";
import { useFiltersStore } from "~/stores/categoryStore";

const MAX = 10000;

const PriceRangeFilter = () => {
  const [range, setRange] = useState<[number, number]>([0, MAX]);
  const { setPriceRange, priceRange } = useFiltersStore((state) => ({
    setPriceRange: state.setPriceRange,
    priceRange: state.filters.priceRange,
  }));

  useEffect(() => {
    if (priceRange === null) {
      setRange([0, MAX]);
    }
  }, [priceRange]);

  return (
    <div className="w-80">
      <Slider
        value={range}
        max={MAX}
        range
        onChange={(val) => void setRange(val)}
      />
      <div className="flex">
        <InputNumber
          onChange={(minVal) => setRange((state) => [minVal ?? 0, state[1]])}
          value={range[0]}
          max={range[1]}
        />
        <InputNumber
          onChange={(maxVal) => setRange((state) => [state[0], maxVal ?? 0])}
          className="mx-auto"
          min={range[0]}
          value={range[1]}
        />
        <Button className="ml-auto" onClick={() => setPriceRange(range)}>
          Apply
        </Button>
      </div>
    </div>
  );
};
export default PriceRangeFilter;
