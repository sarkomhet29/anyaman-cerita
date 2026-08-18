import { Navbar } from "@/components/anyaman/Navbar";
import { Hero } from "@/components/anyaman/Hero";
import { EventTypes } from "@/components/anyaman/EventTypes";
import { ThemeGallery } from "@/components/anyaman/ThemeGallery";
import { WhyUs } from "@/components/anyaman/WhyUs";
import { FeatureGrid } from "@/components/anyaman/FeatureGrid";
import { Pricing } from "@/components/anyaman/Pricing";
import { Testimonials } from "@/components/anyaman/Testimonials";
import { FAQ } from "@/components/anyaman/FAQ";
import { CTASection } from "@/components/anyaman/CTASection";
import { Footer } from "@/components/anyaman/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <EventTypes />
        <ThemeGallery />
        <WhyUs />
        <FeatureGrid />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
