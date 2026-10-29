import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import StatsSection from '@/components/sections/StatsSection'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <FeaturesSection />
      </main>
      <Footer />
    </>
  )
}
