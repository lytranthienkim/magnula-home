import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/redux/Provider';

const interFont = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Magnula Admin',
  description: 'Admin Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${interFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
