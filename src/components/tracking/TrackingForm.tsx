'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Package, AlertCircle, Sparkles } from 'lucide-react'

const TRACKING_NUMBER_RE = /^[A-Z0-9]{8,20}$/

function normalizeTracking(raw: string): string {
  return raw.trim().toUpperCase().replace(/[\s\-_]/g, '')
}

const DEMO_PRESETS = [
  { id: 'SD123456789', label: 'In Transit', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'SD987654321', label: 'Delivered', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'SD555000111', label: 'Exception', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
]

interface TrackingFormProps {
  variant?: 'hero' | 'page'
  initialValue?: string
  className?: string
}

export default function TrackingForm({
  variant = 'page',
  initialValue = '',
  className = '',
}: TrackingFormProps) {
  const router = useRouter()
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validate = (v: string): string | null => {
    const normalized = normalizeTracking(v)
    if (!normalized) return 'Please enter your consignment or tracking number.'
    if (!TRACKING_NUMBER_RE.test(normalized)) {
      return 'Tracking numbers are 8–20 alphanumeric characters (e.g. SD123456789).'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = normalizeTracking(value)
    const validationError = validate(normalized)
    if (validationError) {
      setError(validationError)
      inputRef.current?.focus()
      return
    }
    setError(null)
    setLoading(true)
    try {
      router.push(`/track/${normalized}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPreset = (presetId: string) => {
    setValue(presetId)
    setError(null)
    inputRef.current?.focus()
  }

  const isHero = variant === 'hero'

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full ${className}`}
      noValidate
      aria-label="Consignment tracking form"
    >
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
            <Package size={18} strokeWidth={2.4} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError(null)
            }}
            placeholder="Enter tracking number (e.g. SD123456789)"
            className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-mono tracking-wider transition-all outline-none bg-slate-50 border text-slate-900 placeholder:text-slate-400 placeholder:font-sans ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
            }`}
            aria-label="Tracking number"
            aria-describedby={error ? 'tracking-error' : undefined}
            aria-invalid={!!error}
            autoComplete="off"
            spellCheck={false}
            maxLength={30}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-royal py-3.5 px-6 font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 rounded-xl cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Locating…</span>
            </>
          ) : (
            <>
              <Search size={16} />
              <span>Track Now</span>
            </>
          )}
        </button>
      </div>

      {/* Error alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            id="tracking-error"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="flex items-center gap-2 mt-2.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs"
            role="alert"
          >
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Quick-Chips */}
      {isHero && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
            <Sparkles size={11} className="text-amber-500" />
            Demo Presets:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {DEMO_PRESETS.map(({ id, label, badge }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleSelectPreset(id)}
                className={`text-[11px] font-mono px-2 py-0.5 rounded-md border transition-all cursor-pointer hover:shadow-xs ${badge}`}
              >
                <span>{id}</span>
                <span className="opacity-70 ml-1">({label})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  )
}
