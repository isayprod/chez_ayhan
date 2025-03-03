import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Story } from '@/components/landing/Story';
import { Menu } from '@/components/landing/Menu';
import { OrderSection } from '@/components/landing/OrderSection';
import { Footer } from '@/components/landing/Footer';
import { ScrollToTop } from '@/components/landing/ScrollToTop';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FDF7F2]">
      <Navbar />
      <Hero />
      <Story />
      <Menu />
      <OrderSection />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
