import { useState } from 'react'
import { Shield, Mail, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="text-[#c9a227]" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Agent Portal</h1>
          <p className="text-gray-400 mt-2 text-sm">Paul Williams Insurance Agency</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <CheckCircle className="text-[#c9a227] mx-auto mb-4" size={40} />
              <h2 className="text-white font-bold text-lg mb-2">Check your email</h2>
              <p className="text-gray-400 text-sm">
                We sent a login link to <span className="text-white">{email}</span>. Click it to access the dashboard.
              </p>
              <p className="text-gray-500 text-xs mt-4">No password required. Link expires in 1 hour.</p>
            </div>
          ) : (
            <form onSubmit={handleLogin}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative mb-4">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={16} />
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="paul@paulwilliamsinsurance.com"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#c9a227]"
                />
              </div>
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <button
                type="submit" disabled={loading}
                className="w-full bg-[#c9a227] text-[#0a1628] py-3 rounded-xl font-bold hover:bg-[#e8c547] disabled:opacity-60 transition-colors"
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
              <p className="text-gray-500 text-xs text-center mt-4">
                No password needed — we email you a secure login link.
              </p>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-gray-500 text-sm hover:text-gray-300">← Back to website</a>
        </div>
      </div>
    </div>
  )
}
