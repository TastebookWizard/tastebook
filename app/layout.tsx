import type { Metadata } from 'next';
import './globals.css';

import { Outfit } from 'next/font/google';
import Script from 'next/script'
import { Providers } from '@/lib/providers';

const outfit = Outfit({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://kit.fontawesome.com/8540cdc0f8.js" crossOrigin="anonymous"></Script>
      </head>
      <body
        className={`${outfit.className} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
