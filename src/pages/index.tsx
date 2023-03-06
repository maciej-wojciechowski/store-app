import { Category } from "@prisma/client";
import { Select } from "antd";
import { type DefaultOptionType } from "antd/es/select";
import { type NextPage } from "next";
import ShopItemCard from "~/components/shopItem/ShopItemCard";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: shopItemsData } = api.shopItem.getAll.useQuery();
  const getOptions: () => DefaultOptionType[] = () =>
    Object.keys(Category as Record<string, string>).map((c) => ({
      label: c,
      value: c,
    }));
  return (
    <div>
      <Select className="mb-10 w-36" options={getOptions()} />
      <div className="grid grid-cols-3 gap-10">
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
