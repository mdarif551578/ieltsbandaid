
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { cn } from '@/lib/utils';
import { placeholderImages } from '@/lib/placeholder-images';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-headline' });


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
const title = 'IELTS BandAid - AI IELTS Writing Assessor';
const description = 'Boost Your IELTS Writing Band Score with AI Feedback. Get instant, expert-level analysis based on official criteria.';

const socialShareImage = placeholderImages.find(p => p.id === 'hero-background');

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description,
    url: siteUrl,
    siteName: 'IELTS BandAid',
    images: socialShareImage ? [
      {
        url: socialShareImage.imageUrl,
        width: 1920,
        height: 1080,
        alt: socialShareImage.description,
      },
    ] : [],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: title,
    description: description,
    images: socialShareImage ? [socialShareImage.imageUrl] : [],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2284707925732680"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased', inter.variable, spaceGrotesk.variable)}>
        <Providers>
          <div className="relative flex min-h-dvh flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
