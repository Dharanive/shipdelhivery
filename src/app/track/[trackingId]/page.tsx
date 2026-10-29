import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import TrackingResult from '@/components/tracking/TrackingResult'

interface TrackingPageProps {
  params: Promise<{ trackingId: string }>
}

export async function generateMetadata({ params }: TrackingPageProps): Promise<Metadata> {
  const { trackingId } = await params
  return {
    title: `Tracking ${trackingId}`,
    description: `Shipment tracking details for ${trackingId}`,
  }
}

export default async function TrackingResultPage({ params }: TrackingPageProps) {
  const { trackingId } = await params

  return (
    <>
      <Navigation />
      <main className="pt-20 pb-12" style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
        <div className="container max-w-3xl">
          <TrackingResult trackingId={trackingId} />
        </div>
      </main>
      <Footer />
    </>
  )
}

