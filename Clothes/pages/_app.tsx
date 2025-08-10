// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { NextUIProvider } from "@nextui-org/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <Head>
        <title>clothes</title>
        <meta
          name="description"
          content="clothes- Your beauty destination"
        />
      </Head>
      <main className="min-h-screen bg-white">
        <Component {...pageProps} />
      </main>
    </NextUIProvider>
  );
}
