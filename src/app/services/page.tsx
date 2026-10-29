import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import ServicesHero from '@/components/sections/ServicesHero'
import ServicesGrid from '@/components/sections/ServicesGrid'

export const metadata: Metadata = {
  title: 'Services',
  description: 'End-to-end logistics services including parcel delivery, warehouse sorting, hub transfers, last-mile delivery and business logistics.',
}

export default function ServicesPage() {
  return (
    <>
      <Navigation />
      <main>
        <ServicesHero />
        <ServicesGrid />
      </main>
      <Footer />
    </>
  )
}

