import { type ShopItem } from "@prisma/client";
import { Button, Descriptions } from "antd";
import {
  type GetServerSideProps,
  type NextPage,
  type InferGetServerSidePropsType,
} from "next";
import React from "react";
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
  const addItem = useCartStore((state) => state.addItem);
  return (
    <div className="px-6">
      <div className="sticky top-0 py-6">
        <Link href="/">
          <Button icon={<LeftOutlined />}></Button>
        </Link>
      </div>
      <img
        className="mx-auto"
        src={
          shopItem.image ??
          "https://raw.githubusercontent.com/koehlersimon/fallback/master/Resources/Public/Images/placeholder.jpg"
        }
        alt={shopItem.name}
      />
      <div className="mx-auto my-10 max-w-4xl">
        <Button
          onClick={() => addItem({ id: shopItem.id })}
          className=" float-right bg-themeTurkish text-white "
        >
          Add to cart
        </Button>
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
