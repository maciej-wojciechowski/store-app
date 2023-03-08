import { Spin } from "antd";
import { type NextPage } from "next";
import Filters from "~/components/Filters";
import ShopItemCard from "~/components/shopItem/ShopItemCard";
import { useFiltersStore } from "~/stores/categoryStore";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const category = useFiltersStore((state) => state.filters.category);

  const { data: shopItemsData, isLoading } = api.shopItem.getAll.useQuery({
    category: category === "all" ? null : category,
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
