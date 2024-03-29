import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import MainLayout from "~/components/layouts/MainLayout";
import { ConfigProvider } from "antd";

import localFont from "next/font/local";

const barcelonyFont = localFont({
  src: "../../public/Barcelony.ttf",
  variable: "--font-barcelony",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#22A39F",
          },
        }}
      >
        <MainLayout customFont={barcelonyFont}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Component {...pageProps} />
        </MainLayout>
      </ConfigProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
