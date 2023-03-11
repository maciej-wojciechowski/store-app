import { type ShopItem } from "@prisma/client";
import { Descriptions } from "antd";
import {
  type GetServerSideProps,
  type NextPage,
  type InferGetServerSidePropsType,
} from "next";
import React from "react";
import { capitalizeKeys } from "~/helpers/stringHelpers";
import { prisma } from "~/server/db";

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
  return (
    <div>
      <img
        src={
          shopItem.image ??
          "https://raw.githubusercontent.com/koehlersimon/fallback/master/Resources/Public/Images/placeholder.jpg"
        }
        alt={shopItem.name}
      />
      <Descriptions
        column={1}
        layout="horizontal"
        title={shopItem.name}
        bordered
      >
        <Descriptions.Item label="Price">{shopItem.price}</Descriptions.Item>
        <Descriptions.Item label="In stock">{shopItem.stock}</Descriptions.Item>
        <Descriptions.Item label="Producer">
          {capitalizeKeys(shopItem.producer)}
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          {shopItem.description}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ItemPage;
