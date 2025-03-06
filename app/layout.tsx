import { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { getURL } from '@/utils/helpers';
import '@/styles/main.css';
import { PHProvider } from './providers';
import { ThemeProvider } from '@/components/landing/theme-provider';
import dynamic from 'next/dynamic';
import { Toaster } from '@/components/ui/toaster';

const PostHogPageView = dynamic(() => import('./PostHogPageView'), {
  ssr: false
});

const meta = {
  title: 'Chez Ayhan',
  description: 'Chez Ayhan, la cuisine de la maman.',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: getURL()
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: meta.title,
    description: meta.description,
    referrer: 'origin-when-cross-origin',
    keywords: ['Chez Ayhan', 'Cuisine', 'Maman', 'Lahmacun', 'Pide',
       'Pizza', 'Kebab', 'Sandwich', 'Burger', 'Salade', 'Boisson', 
       'Dessert', 'Ramadan', 'Fast-food', 'Fast-food marocain', 'Fast-food turque', 
       'Fast-food turque marocain', 'Fast-food turque', 'Livraison', 
        'Retrait sur place', 'Ramadan 2025', 'Turquie'],
    authors: [{ name: 'Chez Ayhan', url: 'https://chezayhan.be/' }],
    creator: 'Chez Ayhan',
    publisher: 'Chez Ayhan',
    robots: meta.robots,
    icons: { icon: meta.favicon },
    metadataBase: new URL(meta.url),
    openGraph: {
      url: meta.url,
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage],
      type: 'website',
      siteName: meta.title
    },
    twitter: {
      card: 'summary_large_image',
      site: '@ChezMaman',
      creator: '@ChezMaman',
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage]
    }
  };
}

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <ThemeProvider>
        <PHProvider>
          <body>
            <PostHogPageView />
            <main
              id="skip"
              className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
            >
              {children}
            </main>
            <Toaster />
          </body>
        </PHProvider>
      </ThemeProvider>
    </html>
  );
}
