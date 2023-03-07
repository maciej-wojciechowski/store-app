import { type NextPage } from "next";
import ShopItemCard from "~/components/shopItem/ShopItemCard";
import { useCategoryStore } from "~/stores/categoryStore";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const category = useCategoryStore((state) => state.category);

  const { data: shopItemsData } = api.shopItem.getAll.useQuery({
    category: category,
  });
  return (
    <div>
      <div className="mx-12 mb-14 grid grid-cols-3 gap-10">
        {shopItemsData?.length ? (
          shopItemsData.map((item) => (
            <ShopItemCard key={item.id} shopItemData={item} />
          ))
        ) : (
          <span>No Items</span>
        )}
      </div>
    </div>
  );
};

export default Home;
