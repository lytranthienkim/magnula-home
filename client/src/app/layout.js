import { Damion, Google_Sans_Flex } from "next/font/google";
import '@/styles/globals.css';
import { PreloaderWrapper } from "@/components/layout/preloader/PreloaderWrapper";
import { Providers } from "@/redux/Provider";
import { Footer } from "@/components/common/navigation/Footer";

const googleSansFlexFont = Google_Sans_Flex({
  variable: "--font-google-sans-flex",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap"
});

const damionFont = Damion({
  variable: "--font-damion",
  weight: "400",
  subsets: ["latin"],
  display: "swap"
});

export const metadata = {
  title: {
    default: "Magnula",
    template: "%s | Magnula",
  },
  description: "Furniture That Brings Your Family Together",
  keywords: ["Magnula", "Furniture", "Home Decor", "Interior Design", "Living Room", "Bedroom", "Dining Room", "Office Furniture"],

  openGraph: {
    title: "Magnula",
    description: "Furniture That Brings Your Family Together",
    url: "https://magnula.space",
    siteName: "Magnula",
    images: [
      {
        url: 'https://pub-c0d91e27663a41a5a1671bb31cabfb2a.r2.dev/common/home-thumbnail.png',
        width: 1200,
        height: 630,
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
      className={`${googleSansFlexFont.variable} ${damionFont.variable} h-full antialiased`}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-full flex flex-col justify-between">
        <Providers>
          <PreloaderWrapper>
            {children}
            <Footer />
          </PreloaderWrapper>
        </Providers>
      </body>
    </html>
  );
}
