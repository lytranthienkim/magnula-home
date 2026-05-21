import { Inter } from "next/font/google";
import '@/styles/globals.css';
import { Footer } from "@/components/common/Footer";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Magnula",
  description: "Furniture, home, sofas, elegant, minimal, basic",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${interFont.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Footer/>
      </body>
    </html>
  );
}
