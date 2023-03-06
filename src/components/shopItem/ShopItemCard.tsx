import { type ShopItem } from "@prisma/client";
import { Card } from "antd";
import React from "react";

type Props = {
  shopItemData: ShopItem;
};

function ShopItemCard({ shopItemData }: Props) {
  return (
    <Card
      className="w-[300px] shadow-xl transition-transform hover:scale-[1.01] hover:cursor-pointer"
      cover={
        <div className="">
          <img
            width={"200px"}
            className="mx-auto mt-5 object-contain"
            alt={shopItemData.name}
            src={shopItemData.image}
          />
        </div>
      }
    >
      <Card.Meta
        title={shopItemData.name}
        description={"Price: " + String(shopItemData.price) + " PLN"}
      />
    </Card>
  );
}

export default ShopItemCard;
