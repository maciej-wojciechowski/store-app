import { Avatar, Dropdown, Layout, type MenuProps } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React, { type PropsWithChildren, type ReactElement } from "react";
import { UserOutlined, QuestionOutlined } from "@ant-design/icons";
import Cart from "../cart/Cart";
import { ThunderboltTwoTone } from "@ant-design/icons";
import { type NextFontWithVariable } from "next/dist/compiled/@next/font";

type Props = PropsWithChildren & { customFont: NextFontWithVariable };

const MainLayout: React.FC<Props> = ({ children, customFont }) => {
  const { data: sessionData } = useSession();

  const getLogoMenuItemsAndAvatar: () => {
    avatar: ReactElement;
    menuItems: MenuProps["items"];
  } = () => {
    if (!sessionData?.user) {
      return {
        avatar: <QuestionOutlined />,
        menuItems: [
          {
            key: "0",
            label: <span onClick={() => void signIn()}>Log in</span>,
          },
          {
            key: "1",
            label: (
              <Link href="register">
                <span>Register</span>
              </Link>
            ),
          },
        ],
      };
    }
    return {
      avatar: !sessionData?.user.image ? (
        <UserOutlined className="text-xl" />
      ) : (
        <img
          alt={sessionData.user.name || "user image"}
          src={sessionData.user.image + `?time=${Date.now()}`}
        />
      ),
      menuItems: [
        {
          key: "1",
          label: <Link href="/me/my_profile">Profile</Link>,
        },
        {
          key: "2",
          label: <Link href="/me/my_orders">Orders</Link>,
        },
        {
          key: "3",
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
      <Layout className={`h-full overflow-hidden ${customFont.variable}`}>
        <Layout.Header className="flex items-center bg-themeGrey text-themeWhite">
          <Link className="flex hover:text-inherit" href="/">
            <span className="self-center font-barcelony text-xl hover:text-current">
              Store
            </span>
            <ThunderboltTwoTone
              twoToneColor="#22A39F"
              className="ml-2 text-2xl"
            />
          </Link>
          <div className="flex-1" />
          {sessionData?.user ? (
            <span className="mx-3">{sessionData?.user.name}</span>
          ) : null}
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Avatar
              className="bg-themeGrey ring-2 ring-themeTurkish hover:cursor-pointer"
              size="large"
              src={avatar}
            />
          </Dropdown>
        </Layout.Header>
        <Layout.Content className="relative flex h-[calc(100dvh-64px)] w-screen flex-col overflow-hidden">
          <div className="overflow-scroll">{children}</div>
          <Cart />
        </Layout.Content>
      </Layout>
    </>
  );
};

export default MainLayout;
