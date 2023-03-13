import { Spin } from "antd";
import { type NextPage } from "next";
import Filters from "~/components/filters/Filters";
import ShopItemCard from "~/components/shopItem/ShopItemCard";
import { useFiltersStore } from "~/stores/categoryStore";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const filters = useFiltersStore((state) => state.filters);

  const { data: shopItemsData, isLoading } = api.shopItem.getAll.useQuery({
    category: filters.category === "all" ? null : filters.category,
    priceRange: filters.priceRange,
    producer: filters.producer,
  });

  return (
    <div>
      <Filters />
      <div className="mx-auto">
        <Spin spinning={isLoading}>
          {shopItemsData?.length ? (
            <div className="mx-4 mb-14 grid grid-cols-1 justify-items-stretch gap-5 sm:mx-12 sm:gap-10 md:grid-cols-2 xl:grid-cols-3 xl:gap-20">
              {shopItemsData.map((item) => (
                <ShopItemCard key={item.id} shopItemData={item} />
              ))}
            </div>
          ) : (
            <div className="flex h-full min-h-[80vh] w-full">
              {!isLoading && <span className="m-auto">No Items</span>}
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default Home;
