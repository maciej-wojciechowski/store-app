import { Spin } from "antd";
import { type NextPage } from "next";
import Filters from "~/components/Filters";
import ShopItemCard from "~/components/shopItem/ShopItemCard";
import { useFiltersStore } from "~/stores/categoryStore";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const filters = useFiltersStore((state) => state.filters);

  const { data: shopItemsData, isLoading } = api.shopItem.getAll.useQuery({
    category: filters.category === "all" ? null : filters.category,
    priceRange: filters.priceRange,
  });

  return (
    <div>
      <Filters />
      <Spin spinning={isLoading}>
        <div className="mx-12 mb-14 grid grid-cols-3 gap-10">
          {shopItemsData?.length ? (
            shopItemsData.map((item) => (
              <ShopItemCard key={item.id} shopItemData={item} />
            ))
          ) : (
            <span>No Items</span>
          )}
        </div>
      </Spin>
    </div>
  );
};

export default Home;
