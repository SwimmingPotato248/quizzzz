import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { Mali } from "@next/font/google";

const mali = Mali({
  subsets: ["latin", "vietnamese"],
  variable: "--font-mali",
  weight: ["200", "300", "400", "500", "600", "700"],
});

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title key={"title"}>Quizzzz</title>
      </Head>
      <SessionProvider session={session}>
        <div className={`${mali.variable} font-sans`}>
          <Layout key={router.asPath}>
            <Component {...pageProps} />
          </Layout>
        </div>
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
