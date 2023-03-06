import { type NextPage } from "next";
import ShopItemCard from "~/components/shopItem/ShopItemCard";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: shopItemsData } = api.shopItem.getAll.useQuery();

  return (
    <div className="grid gap-5">
      {shopItemsData?.length ? (
        shopItemsData.map((item) => (
          <ShopItemCard key={item.id} shopItemData={item} />
        ))
      ) : (
        <span>No Items</span>
      )}
    </div>
  );
};

export default Home;
