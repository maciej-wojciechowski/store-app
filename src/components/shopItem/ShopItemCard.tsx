import { type ShopItem } from "@prisma/client";
import { Badge, Card } from "antd";
import Link from "next/link";
import React from "react";

type Props = {
  shopItemData: ShopItem;
};

function ShopItemCard({ shopItemData }: Props) {
  return (
    <Link href={`item/${shopItemData.id}`}>
      <Badge.Ribbon
        className={`${shopItemData.stock <= 0 ? "" : "hidden"}`}
        color="red"
        text="Out of stock"
      >
        <Card
          hoverable
          className="shadow-xl transition-transform hover:cursor-pointer"
          cover={
            <div className="h-72 overflow-hidden">
              <img
                className="mx-auto"
                alt={shopItemData.name}
                src={
                  shopItemData.images.length
                    ? shopItemData.images[0]
                    : "/placeholder.jpeg"
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
      </Badge.Ribbon>
    </Link>
  );
}

export default ShopItemCard;
