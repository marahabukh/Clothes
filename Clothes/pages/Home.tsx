import { AppProps } from "next/app";
import Herosection from "./HomePage/Herosection";
import Category from "./HomePage/Category";
import Bestseller from "./HomePage/Bestseller";

export default function Home({ Component, pageProps }: AppProps) {
  return (
    <><Herosection />
    <Category />
    <Bestseller/></>
  );
}