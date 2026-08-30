import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
