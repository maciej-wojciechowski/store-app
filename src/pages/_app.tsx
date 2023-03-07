import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import MainLayout from "~/components/layouts/MainLayout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <MainLayout>
        <ReactQueryDevtools initialIsOpen={false} />
        <Component {...pageProps} />
      </MainLayout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
