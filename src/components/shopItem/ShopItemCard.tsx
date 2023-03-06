import { type ShopItem } from "@prisma/client";
import { Card } from "antd";
import React from "react";

type Props = {
  shopItemData: ShopItem;
};

function ShopItemCard({ shopItemData }: Props) {
  return (
    <Card
      className="h-[500px] w-[500px] shadow-xl transition-transform hover:scale-[1.01] hover:cursor-pointer"
      cover={
        <div className="h-[400px] w-full overflow-hidden">
          <img
            className="mx-auto my-auto"
            alt={shopItemData.name}
            src={
              shopItemData.image ??
              "https://raw.githubusercontent.com/koehlersimon/fallback/master/Resources/Public/Images/placeholder.jpg" //TODO
            }
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
