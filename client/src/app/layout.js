import { Damion } from "next/font/google";
import '@/styles/globals.css';
import { PreloaderWrapper } from "@/components/layout/preloader/PreloaderWrapper";
import { Providers } from "@/redux/Provider";

const damionFont = Damion({
  variable: '--font-damion',
  weight: '400',
  subsets: ["latin"]
})

export const metadata = {
  title: "Magnula",
  description: "Furniture, home, sofas, elegant, minimal, basic",
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
