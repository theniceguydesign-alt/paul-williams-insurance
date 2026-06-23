import { useState, FormEvent } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function Login() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin + '/admin',
      },
    })

    if (error) {
      setStatus('error')
      setMessage(error.message)
    } else {
      setStatus('success')
      setMessage('Check your email for a login link.')
      setEmail('')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: '#F7F5F0',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          border: '1.5px solid rgba(19,22,27,0.10)',
          borderRadius: '20px',
          padding: '48px 36px',
          boxShadow: '0 8px 40px rgba(19,22,27,0.06)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(45,212,191,0.15), rgba(45,212,191,0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontFamily: "'Space Grotesk', 'Bricolage Grotesque', sans-serif",
              fontWeight: 700,
              fontSize: '18px',
              color: '#13161B',
              letterSpacing: '0.5px',
            }}
          >
            CS
          </div>
          <h1
            style={{
              fontFamily: "'Space Grotesk', 'Bricolage Grotesque', sans-serif",
              fontWeight: 700,
              fontSize: '22px',
              color: '#13161B',
              letterSpacing: '-0.02em',
              marginBottom: '6px',
            }}
          >
            Crestlake Studio
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#5B6472',
              margin: 0,
            }}
          >
            Admin Portal
          </p>
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <div
            style={{
              backgroundColor: 'rgba(45,212,191,0.10)',
              border: '1px solid rgba(45,212,191,0.30)',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#0D9488',
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            {message}
          </div>
        )}

        {status === 'error' && (
          <div
            style={{
              backgroundColor: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#dc2626',
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: '#13161B',
              marginBottom: '8px',
              letterSpacing: '0.02em',
            }}
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourbusiness.com"
            required
            disabled={status === 'loading'}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '15px',
              fontFamily: "'Inter', system-ui, sans-serif",
              color: '#13161B',
              backgroundColor: '#F7F5F0',
              border: '1.5px solid rgba(19,22,27,0.10)',
              borderRadius: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s ease',
              marginBottom: '20px',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2DD4BF'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(19,22,27,0.10)'
            }}
          />

          <button
            type="submit"
            disabled={status === 'loading' || !email.trim()}
            style={{
              width: '100%',
              padding: '15px 24px',
              fontSize: '14px',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 600,
              color: '#13161B',
              backgroundColor: '#2DD4BF',
              border: 'none',
              borderRadius: '12px',
              cursor: status === 'loading' ? 'wait' : 'pointer',
              opacity: status === 'loading' || !email.trim() ? 0.6 : 1,
              transition: 'all 0.2s ease',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={(e) => {
              if (status !== 'loading' && email.trim()) {
                e.currentTarget.style.backgroundColor = '#14B8A6'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2DD4BF'
            }}
          >
            {status === 'loading' ? 'Sending...' : 'Send Login Link'}
          </button>
        </form>

        {/* Footer */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#9CA3AF',
            marginTop: '24px',
            lineHeight: 1.5,
          }}
        >
          We'll email you a secure login link. No password needed.
        </p>
      </div>
    </div>
  )
}
