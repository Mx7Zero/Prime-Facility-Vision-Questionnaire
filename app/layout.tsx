import type { Metadata, Viewport } from 'next';
import { Orbitron, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Prime Facility Vision | 60,000 SF Sports Performance + Longevity — Phoenix, AZ',
  description:
    'Help design a world-class 60,000 SF facility combining elite sports performance training, cutting-edge longevity medicine, GLP-1 programs, and regenerative therapies. Your vision shapes every square foot. Phoenix, AZ.',
  keywords: [
    'sports performance facility',
    'longevity clinic',
    'Phoenix AZ',
    'GLP-1',
    'regenerative medicine',
    'athletic training',
    'biohacking',
    'sports medicine',
  ],
  openGraph: {
    type: 'website',
    title: 'Prime Facility Vision — 60,000 SF Sports + Longevity Facility',
    description:
      '🏗️ We\'re building a 60,000 SF sports performance + longevity medicine facility in Phoenix, AZ. Elite training. Cutting-edge science. GLP-1 & regenerative medicine. Your input shapes the vision.',
    siteName: 'Prime Facility Vision',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prime Facility Vision — 60K SF Sports + Longevity Facility',
    description:
      '🏗️ 60,000 SF. Elite sports training. Longevity medicine. GLP-1 programs. Phoenix, AZ. Help us design the future — take the questionnaire.',
  },
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0F',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-body antialiased relative">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
