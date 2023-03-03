import { Layout } from "antd";
import Head from "next/head";
import Link from "next/link";
import React, { PropsWithChildren } from "react";

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Store</title>
        <meta name="description" content="Project management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="h-[100vh] overflow-hidden">
        <Layout.Header className="!text-white">
          <Link href={"/"}>
            <span>Store</span>
          </Link>
        </Layout.Header>
        <Layout.Content className="flex h-[calc(100vh-65px)] h-screen w-screen flex-col overflow-scroll py-6 px-12">
          {children}
        </Layout.Content>
      </Layout>
    </>
  );
};

export default MainLayout;
