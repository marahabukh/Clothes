import { AppProps } from "next/app";
import Category from "./HomePage/Category";
import Bestseller from "./HomePage/Bestseller";
import NavBar from "./HomePage/NavBar";
import HeroSection from "./HomePage/Herosection";

export default function Home({ Component, pageProps }: AppProps) {
  return (
    <>
    <NavBar/>
    <HeroSection/>
    <Category />
  
    <Bestseller/></>
  );
}