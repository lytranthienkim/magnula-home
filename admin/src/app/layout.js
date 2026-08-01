import { inter } from '@/lib/fonts';
import '@/styles/globals.css';
import { Providers } from '@/redux/Provider';

export const metadata = {
  title: 'Magnula Admin',
  description: 'Admin Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
