'use client'

import { motion } from 'motion/react'

export default function ServicesHero() {
  return (
    <section
      className="dark-section pt-28 pb-16"
      style={{ background: 'linear-gradient(160deg, #0B1220 0%, #0D1B30 50%, #0B1220 100%)' }}
    >
      <div className="container text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="badge badge-blue mb-4 inline-block"
        >
          OUR SERVICES
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-3xl sm:text-5xl font-bold mb-5"
          style={{ color: 'var(--color-text-light)' }}
        >
          End-to-End <span className="text-gradient">Logistics Solutions</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-lg mx-auto text-base"
          style={{ color: 'var(--color-text-dim)' }}
        >
          From the first scan to the final delivery signature, every stage of the logistics
          pipeline is connected, visible, and verified.
        </motion.p>
      </div>
    </section>
  )
}

