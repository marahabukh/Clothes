import { Noto_Kufi_Arabic } from "next/font/google";

export const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-noto-kufi",
});
