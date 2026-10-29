'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Package, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)

    // Phase 4: Replace with real Supabase Auth
    // For now, show a configuration message
    setLoading(false)
    setError(
      'Authentication is not yet configured. Complete Supabase setup and configure your .env.local to enable staff login.'
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #0B1220 0%, #0D1B30 50%, #0B1220 100%)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 font-bold text-xl no-underline mb-8"
          style={{ color: 'var(--color-text-light)' }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--color-blue)' }}
          >
            <Package size={18} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <span>
            Ship<span style={{ color: 'var(--color-blue)' }}>delhivery</span>
          </span>
        </Link>

        <div className="card-dark p-6">
          <h1
            className="text-lg font-semibold text-center mb-1"
            style={{ color: 'var(--color-text-light)' }}
          >
            Staff Login
          </h1>
          <p className="text-center text-sm mb-6" style={{ color: 'var(--color-text-dim)' }}>
            Sign in to access warehouse and admin operations.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-dim)' }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-dark"
                placeholder="staff@shipdelhivery.in"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-dim)' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-dark pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-dim)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm"
                style={{
                  background: 'rgb(239 68 68 / 0.1)',
                  border: '1px solid rgb(239 68 68 / 0.2)',
                  color: 'rgb(239 100 100)',
                }}
                role="alert"
              >
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm no-underline"
            style={{ color: 'var(--color-text-dim)' }}
          >
            <ArrowLeft size={14} />
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

