import { Damion } from "next/font/google";
import '@/styles/globals.css';
import { PreloaderWrapper } from "@/components/layout/preloader/PreloaderWrapper";
import { Providers } from "@/redux/Provider";

const damionFont = Damion({
  variable: '--font-damion',
  weight: '400',
  subsets: ["latin"],
  display: 'swap'
})

export const metadata = {
  title: "Magnula",
  template: "$s | Magnula",
  description: "Furniture That Brings Your Family Together.",
  keyWords: ["Magnula", "Furniture", "Home Decor", "Interior Design", "Living Room", "Bedroom", "Dining Room", "Office Furniture"],

  openGraph: {
    title: "Magnula",
    description: "Furniture That Brings Your Family Together.",
    url: "https://magnula.space",
    siteName: "Magnula",
    images: [
      {
        url: 'https://d1yei2z3i6k35z.cloudfront.net/14433334/68c7b26dce7d0_MagnulaText.png',
        width: 1500,
        height: 260,
        alt: "Magnula Text Logo",
      },
    ],
    locale: "en-US",
    type: "website",
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${damionFont.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col justify-between">
        <Providers>
          <PreloaderWrapper>
            {children}
          </PreloaderWrapper>
        </Providers>
      </body>
    </html>
  );
}
