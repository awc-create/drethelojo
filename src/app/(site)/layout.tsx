// src/app/(site)/layout.tsx
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
