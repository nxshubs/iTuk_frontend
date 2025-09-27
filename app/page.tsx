import Header from "@/components/shared/Header"
import HeroSection from "@/features/landing/HeroSection"
import FeaturesSection from "@/features/landing/FeaturesSection"
import HowItWorksSection from "@/features/landing/HowItWorksSection"
// import StatsSection from "@/components/StatsSection"
import TestimonialsSection from "@/features/landing/TestimonialsSection"
import PricingSection from "@/features/landing/PricingSection"
import FAQSection from "@/features/landing/FAQSection"
import CTASection from "@/features/landing/CTASection"
import Footer from "@/features/landing/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        {/* <StatsSection /> */}
        {/* <FeaturesSection /> */}
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
