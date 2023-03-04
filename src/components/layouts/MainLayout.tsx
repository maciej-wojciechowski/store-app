import { Avatar, Dropdown, Layout, MenuProps } from "antd";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React, { PropsWithChildren } from "react";
import { UserOutlined } from "@ant-design/icons";

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { data: sessionData } = useSession();

  const getAvatar = () => {
    if (!sessionData?.user) {
      return <span className="text-xs">Log in</span>;
    }
    if (sessionData?.user.image) {
      return (
        <img
          alt={sessionData.user.name || "user image"}
          src={sessionData.user.image}
        />
      );
    }
    return <UserOutlined className="text-xl" />;
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          Sign out
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item (disabled)
        </a>
      ),
      disabled: true,
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item (disabled)
        </a>
      ),
      disabled: true,
    },
  ];

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
          <Dropdown menu={{ items }}>
            <Avatar
              className="bg-gray-100 text-black"
              size="large"
              src={getAvatar()}
            />
          </Dropdown>
        </Layout.Header>
        <Layout.Content className="flex h-[calc(100vh-65px)] h-screen w-screen flex-col overflow-scroll py-6 px-12">
          {children}
        </Layout.Content>
      </Layout>
    </>
  );
};

export default MainLayout;
