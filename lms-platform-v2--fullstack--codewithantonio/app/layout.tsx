import './globals.css';

import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import ToasterProvider from '@/components/providers/toaster-provider';

const font = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  display: 'swap',
});

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en' className={font.className}>
        <body>
          <ToasterProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}