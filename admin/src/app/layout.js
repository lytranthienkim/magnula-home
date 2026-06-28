import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/redux/Provider';

const inter = Inter({
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata = {
  title: 'Magnula Admin',
  description: 'Admin Dashboard for Magnula Sofa Store',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
