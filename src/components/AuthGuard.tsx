import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(!!data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
      <div className="text-white text-lg">Loading...</div>
    </div>
  )

  return authenticated ? <>{children}</> : <Navigate to="/login" replace />
}
