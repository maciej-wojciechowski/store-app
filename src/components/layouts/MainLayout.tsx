import { Avatar, Dropdown, Layout, Menu, Popover, type MenuProps } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React, {
  useRef,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import {
  UserOutlined,
  MenuUnfoldOutlined,
  SlidersOutlined,
} from "@ant-design/icons";
import { getCategoriesKeyLabelWithAll } from "~/helpers/selectsHelpers";
import { useFiltersStore } from "~/stores/categoryStore";
import { type Category } from "@prisma/client";
import PriceRangeFilter from "../filters/PriceRangeFilter";

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { data: sessionData } = useSession();
  const {
    filters: { category },
    setCategory,
  } = useFiltersStore();

  const SideMenuItems: MenuProps["items"] = [
    {
      key: "categories",
      icon: <MenuUnfoldOutlined />,
      label: "Categories",
      children: getCategoriesKeyLabelWithAll(),
    },
    {
      key: "priceRange",
      icon: <SlidersOutlined />,
      label: "Price",
    },
  ];

  const getLogoMenuItemsAndAvatar: () => {
    avatar: ReactElement;
    menuItems: MenuProps["items"];
  } = () => {
    if (!sessionData?.user) {
      return {
        avatar: <span className="text-xs">Log in</span>,
        menuItems: [
          {
            key: "1",
            label: <span onClick={() => void signIn()}>Log in</span>,
          },
        ],
      };
    }
    if (sessionData?.user.image) {
      return {
        avatar: (
          <img
            alt={sessionData.user.name || "user image"}
            src={sessionData.user.image}
          />
        ),
        menuItems: [
          {
            key: "1",
            label: <Link href="#">My profile</Link>,
          },
          {
            key: "2",
            label: <span onClick={() => void signOut()}>Log out</span>,
          },
        ],
      };
    }
    return {
      avatar: <UserOutlined className="text-xl" />,
      menuItems: [
        {
          key: "1",
          label: <Link href="#">My profile</Link>,
        },
        {
          key: "2",
          label: <span onClick={() => void signOut()}>Log out</span>,
        },
      ],
    };
  };

  const { avatar, menuItems } = getLogoMenuItemsAndAvatar();

  return (
    <>
      <Head>
        <title>Store</title>
        <meta name="description" content="Project management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="h-[100vh] overflow-hidden">
        <Layout.Header className="flex items-center text-white">
          <Link href={"/"}>
            <span>Store</span>
          </Link>
          <div className="flex-1" />
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Avatar
              className="bg-gray-100 text-black hover:cursor-pointer"
              size="large"
              src={avatar}
            />
          </Dropdown>
        </Layout.Header>
        <Layout>
          <Layout.Sider width={200} style={{ background: "#fff" }}>
            <Menu
              onSelect={({ key, keyPath }) => {
                if (keyPath.length === 2 && keyPath[1] === "categories")
                  setCategory(key as Category);
              }}
              mode="vertical"
              selectedKeys={[category ?? "all"]}
              style={{ height: "100%", borderRight: 0 }}
              // items={SideMenuItems}
            >
              <Menu.SubMenu
                title="Categories"
                key="categories"
                icon={<MenuUnfoldOutlined />}
              >
                {getCategoriesKeyLabelWithAll().map(({ key, label }) => (
                  <Menu.Item key={key}>{label}</Menu.Item>
                ))}
              </Menu.SubMenu>
              <Popover placement="rightTop" content={<PriceRangeFilter />}>
                <Menu.Item icon={<SlidersOutlined />}>Price range</Menu.Item>
              </Popover>
            </Menu>
          </Layout.Sider>

          <Layout.Content className="flex h-screen w-screen flex-col overflow-scroll py-6 px-12">
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
    </>
  );
};

export default MainLayout;
