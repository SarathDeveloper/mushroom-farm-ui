import Navbar from "@/components/Navbar";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import Providers from "@/components/Providers";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <AnnouncementBar />
      <Navbar />
      <main id="main-content" className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <WhatsAppWidget />
      <MobileBottomNav />
    </Providers>
  );
}
