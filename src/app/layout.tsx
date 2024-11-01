import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import localFont from 'next/font/local';
import { DM_Sans } from "next/font/google";
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/use-auth-context';
import Head from 'next/head';

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'ChatAI',
  description: 'Your AI Customer Representative',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <AuthProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} antialiased font-[family-name:var(--font-geist-sans)] bg-background`}
          >
            {children}
            <Toaster />
          </body>
        </AuthProvider>
      </html>
    </ClerkProvider>
  );
}
