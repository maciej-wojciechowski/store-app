import { type ShopItem } from "@prisma/client";
import { Card } from "antd";
import Link from "next/link";
import React from "react";

type Props = {
  shopItemData: ShopItem;
};

function ShopItemCard({ shopItemData }: Props) {
  return (
    <Link href={`item/${shopItemData.id}`}>
      <Card
        hoverable
        style={{ width: 400 }}
        className="shadow-xl transition-transform hover:cursor-pointer"
        cover={
          <div className="h-72 overflow-hidden">
            <img
              className="mx-auto"
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
    </Link>
  );
}

export default ShopItemCard;
