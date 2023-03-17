import { type ShopItem } from "@prisma/client";
import { Button, Descriptions, InputNumber } from "antd";
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
  const [pcs, setPcs] = useState(1);

  const { addItem, items } = useCartStore((state) => ({
    addItem: state.addItem,
    items: state.items,
  }));

  const currentItemPcsInCart =
    items.find((el) => el.id === shopItem.id)?.pcs ?? 0;

  const itemsLeft = shopItem.stock - currentItemPcsInCart;

  return (
    <div className="px-6">
      <div className="sticky top-0 py-6">
        <Link href="/">
          <Button icon={<LeftOutlined />}></Button>
        </Link>
      </div>
      <img
        className="mx-auto"
        src={shopItem.image ?? "/placeholder.jpeg"}
        alt={shopItem.name}
      />
      <div className="relative mx-auto my-10 max-w-4xl">
        <div className="absolute right-0 flex justify-end">
          <InputNumber
            addonBefore={<span>pcs</span>}
            className="mr-2 w-28"
            min={1}
            onChange={(val) => val && setPcs(val)}
            disabled={itemsLeft <= 0}
            max={itemsLeft}
            value={pcs}
          />
          <Button
            onClick={() => {
              if (itemsLeft <= 0) {
                return;
              }
              addItem({
                id: shopItem.id,
                name: shopItem.name,
                price: shopItem.price,
                image: shopItem.image,
                stock: shopItem.stock,
                pcs: pcs,
              });
            }}
            className="bg-themeTurkish text-white "
          >
            Add to cart
          </Button>
        </div>
        <Descriptions
          className=""
          column={1}
          layout="horizontal"
          title={shopItem.name}
          bordered
        >
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
