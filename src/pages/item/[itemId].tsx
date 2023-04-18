import { type ShopItem } from "@prisma/client";
import { Button, Carousel, Descriptions, InputNumber, Typography } from "antd";
import {
  type GetServerSideProps,
  type NextPage,
  type InferGetServerSidePropsType,
} from "next";
import React, { useState } from "react";
import { capitalizeKeys } from "~/helpers/stringHelpers";
import { prisma } from "~/server/db";
import { LeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useCartStore } from "~/stores/cartStore";

export const getServerSideProps: GetServerSideProps<
  { shopItem: ShopItem },
  { itemId: string }
> = async (context) => {
  const shopItem = await prisma.shopItem.findUniqueOrThrow({
    where: {
      id: context?.params?.itemId ?? "",
    },
  });
  return {
    props: { shopItem }, // will be passed to the page component as props
  };
};

const ItemPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ shopItem }) => {
  const [qty, setQty] = useState(1);

  const { addItem, items } = useCartStore((state) => ({
    addItem: state.addItem,
    items: state.items,
  }));

  const currentItemPcsInCart =
    items.find((el) => el.id === shopItem.id)?.qty ?? 0;

  const itemsLeft = shopItem.stock - currentItemPcsInCart;

  return (
    <div className="px-6">
      <div className="sticky top-0 z-10 py-6">
        <Link href="/">
          <Button icon={<LeftOutlined />}></Button>
        </Link>
      </div>
      <Carousel centerMode className="[&_.slick-dots_button]:!bg-themeTurkish">
        {!shopItem.images.length ? (
          <div>
            <img
              className="mx-auto max-h-96 w-auto"
              src="/placeholder.jpeg"
              alt={shopItem.name}
            />
          </div>
        ) : (
          shopItem.images.map((image, index) => (
            <div className="!flex h-[600px] justify-center" key={index}>
              <img
                className="max-h-min object-contain sm:object-scale-down"
                src={image}
                alt={shopItem.name + String(index)}
              />
            </div>
          ))
        )}
      </Carousel>
      <div className="mx-auto my-10 max-w-4xl">
        <div className="flex flex-col sm:flex-row">
          <Typography.Title level={3}>{shopItem.name}</Typography.Title>
          <div className="xs:flex-1" />
          <div className="my-2 flex flex-1 justify-between sm:justify-end">
            {itemsLeft <= 0 && (
              <span className="mr-2 self-center">Out of stock</span>
            )}
            <InputNumber
              addonBefore={<span>Qty</span>}
              className="mr-2 w-28"
              min={1}
              onChange={(val) => val && setQty(val)}
              disabled={itemsLeft <= 0}
              max={itemsLeft}
              value={qty}
            />
            <Button
              disabled={itemsLeft <= 0}
              onClick={() => {
                if (itemsLeft <= 0) {
                  return;
                }
                addItem({
                  id: shopItem.id,
                  name: shopItem.name,
                  price: shopItem.price,
                  image: shopItem.images[0] ?? "/placeholder.jpeg",
                  stock: shopItem.stock,
                  qty: qty,
                });
              }}
              type="primary"
            >
              Add to cart
            </Button>
          </div>
        </div>
        <Descriptions className="" column={1} layout="horizontal" bordered>
          <Descriptions.Item label="Price">{shopItem.price}</Descriptions.Item>
          <Descriptions.Item label="In stock">
            {shopItem.stock}
          </Descriptions.Item>
          <Descriptions.Item label="Producer">
            {capitalizeKeys(shopItem.producer)}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {shopItem.description}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
};

export default ItemPage;
