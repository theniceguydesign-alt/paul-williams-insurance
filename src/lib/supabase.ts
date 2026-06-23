import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars not set — running in static/demo mode')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)

export type Lead = {
  id?: string
  name: string
  email: string
  phone: string
  message?: string
  coverage_type?: string
  status?: string
  notes?: string
  created_at?: string
}

export type IntakeSubmission = {
  id?: string
  data: Record<string, unknown>
  status?: string
  created_at?: string
}

export type Message = {
  id?: string
  name: string
  email: string
  phone?: string
  subject?: string
  body: string
  read?: boolean
  created_at?: string
}
