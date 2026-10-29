import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import TrackingForm from '@/components/tracking/TrackingForm'
import { Package, Search, Clock, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Track Shipment',
  description: 'Enter your tracking number to see real-time shipment status and delivery history.',
}

export default function TrackPage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section
          className="pt-28 pb-16"
          style={{ background: 'linear-gradient(160deg, #0B1220 0%, #0D1B30 60%, #142238 100%)' }}
        >
          <div className="container max-w-2xl text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgb(56 189 248 / 0.12)' }}
            >
              <Package size={28} style={{ color: 'var(--color-blue)' }} />
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: 'var(--color-text-light)' }}
            >
              Track Your Shipment
            </h1>
            <p className="mb-8" style={{ color: 'var(--color-text-dim)' }}>
              Enter your tracking number below to see real-time status updates, delivery history,
              and estimated arrival.
            </p>

            <TrackingForm variant="hero" />
          </div>
        </section>

        {/* How it works */}
        <section className="section-sm" style={{ background: 'var(--color-bg)' }}>
          <div className="container max-w-3xl">
            <h2 className="text-xl font-semibold text-center mb-8" style={{ color: 'var(--color-text)' }}>
              How Tracking Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: Search,
                  title: 'Enter Number',
                  desc: 'Type your tracking number in the field above. It starts with SD followed by digits.',
                },
                {
                  icon: Clock,
                  title: 'View Timeline',
                  desc: 'See every confirmed checkpoint from pickup to delivery with timestamps.',
                },
                {
                  icon: MapPin,
                  title: 'Track Location',
                  desc: 'View which hub currently holds your shipment and the estimated delivery date.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card p-5 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{
                        background: 'rgb(56 189 248 / 0.08)',
                        color: 'var(--color-blue)',
                      }}
                    >
                      <Icon size={20} />
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)' }}>
                    {title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

