import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../lib/supabase'

interface Lead {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string
  coverage_type: string
  message: string
  status: string
  source: string
}

interface IntakeSubmission {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  phone: string
  coverage_types: string[]
  status: string
  internal_notes: string | null
  data: Record<string, unknown>
}

export default function Admin() {
  const navigate = useNavigate()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'leads' | 'intake'>('leads')
  const [leads, setLeads] = useState<Lead[]>([])
  const [intakes, setIntakes] = useState<IntakeSubmission[]>([])
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, closed: 0, intakeTotal: 0 })
  const [error, setError] = useState('')

  // Auth guard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login')
        return
      }
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/login')
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const fetchData = useCallback(async () => {
    if (!session) return
    setError('')

    // Fetch leads
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (leadsError) {
      setError(leadsError.message)
      return
    }
    setLeads(leadsData || [])

    // Fetch intake submissions
    const { data: intakeData, error: intakeError } = await supabase
      .from('intake_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (intakeError) {
      setError(intakeError.message)
      return
    }
    setIntakes(intakeData || [])

    // Calculate stats client-side
    const allLeads = leadsData || []
    setStats({
      total: allLeads.length,
      new: allLeads.filter((l) => l.status === 'new').length,
      contacted: allLeads.filter((l) => l.status === 'contacted').length,
      closed: allLeads.filter((l) => l.status === 'closed').length,
      intakeTotal: (intakeData || []).length,
    })
  }, [session])

  useEffect(() => {
    if (session) fetchData()
  }, [session, fetchData])

  const updateLeadStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('leads').update({ status }).eq('id', id)
    if (error) {
      setError(error.message)
    } else {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
      fetchData()
    }
  }

  const updateIntakeStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('intake_submissions').update({ status }).eq('id', id)
    if (error) {
      setError(error.message)
    } else {
      setIntakes((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
      fetchData()
    }
  }

  const updateIntakeNotes = async (id: string, notes: string) => {
    const { error } = await supabase.from('intake_submissions').update({ internal_notes: notes }).eq('id', id)
    if (error) {
      setError(error.message)
    } else {
      setIntakes((prev) => prev.map((i) => (i.id === id ? { ...i, internal_notes: notes } : i)))
    }
  }

  const deleteLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return
    const { error } = await supabase.from('leads').delete().eq('id', id)
    if (error) {
      setError(error.message)
    } else {
      setLeads((prev) => prev.filter((l) => l.id !== id))
      fetchData()
    }
  }

  const deleteIntake = async (id: string) => {
    if (!confirm('Delete this intake submission?')) return
    const { error } = await supabase.from('intake_submissions').delete().eq('id', id)
    if (error) {
      setError(error.message)
    } else {
      setIntakes((prev) => prev.filter((i) => i.id !== id))
      fetchData()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-[rgba(45,212,191,0.12)] text-[#0D9488]',
      contacted: 'bg-[rgba(232,176,75,0.12)] text-[#92400E]',
      closed: 'bg-[rgba(34,197,94,0.12)] text-[#15803D]',
      lost: 'bg-[rgba(239,68,68,0.08)] text-[#DC2626]',
      pending: 'bg-[rgba(245,158,11,0.10)] text-[#B45309]',
      approved: 'bg-[rgba(34,197,94,0.12)] text-[#15803D]',
      declined: 'bg-[rgba(239,68,68,0.08)] text-[#DC2626]',
    }
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
        {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="text-sm text-[#5B6472]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      {/* Header */}
      <header className="bg-white border-b border-[rgba(19,22,27,0.08)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[rgba(45,212,191,0.12)] flex items-center justify-center font-bold text-sm text-[#13161B]">
              CS
            </div>
            <h1 className="text-lg font-bold text-[#13161B]">Crestlake Studio — Admin</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-[#5B6472] hover:text-[#13161B] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)] text-[#dc2626] text-sm font-medium">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {[
            { label: 'Total Leads', value: stats.total },
            { label: 'New', value: stats.new },
            { label: 'Contacted', value: stats.contacted },
            { label: 'Closed', value: stats.closed },
            { label: 'Intakes', value: stats.intakeTotal },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-[rgba(19,22,27,0.08)] p-4 text-center">
              <div className="text-2xl font-bold text-[#13161B]">{s.value}</div>
              <div className="text-xs text-[#5B6472] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl border border-[rgba(19,22,27,0.08)] p-1 inline-flex">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'leads' ? 'bg-[#13161B] text-white' : 'text-[#5B6472] hover:text-[#13161B]'
            }`}
          >
            Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('intake')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'intake' ? 'bg-[#13161B] text-white' : 'text-[#5B6472] hover:text-[#13161B]'
            }`}
          >
            Intake ({intakes.length})
          </button>
        </div>

        {/* Leads Table */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-xl border border-[rgba(19,22,27,0.08)] overflow-hidden">
            {leads.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#5B6472]">No leads yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F7F5F0] text-[#5B6472] text-xs uppercase tracking-wider">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Name</th>
                      <th className="text-left px-4 py-3 font-semibold">Contact</th>
                      <th className="text-left px-4 py-3 font-semibold">Type</th>
                      <th className="text-left px-4 py-3 font-semibold">Status</th>
                      <th className="text-left px-4 py-3 font-semibold">Date</th>
                      <th className="text-left px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(19,22,27,0.06)]">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[rgba(19,22,27,0.02)]">
                        <td className="px-4 py-3 font-medium text-[#13161B]">{lead.full_name}</td>
                        <td className="px-4 py-3 text-[#5B6472]">
                          <div>{lead.email}</div>
                          <div className="text-xs">{lead.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-[#5B6472] capitalize">{lead.coverage_type}</td>
                        <td className="px-4 py-3">{statusBadge(lead.status)}</td>
                        <td className="px-4 py-3 text-xs text-[#5B6472] whitespace-nowrap">{formatDate(lead.created_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {lead.status === 'new' && (
                              <button
                                onClick={() => updateLeadStatus(lead.id, 'contacted')}
                                className="text-xs px-2.5 py-1 rounded-md bg-[rgba(45,212,191,0.10)] text-[#0D9488] font-medium hover:bg-[rgba(45,212,191,0.20)] transition-colors"
                              >
                                Mark Contacted
                              </button>
                            )}
                            {lead.status === 'contacted' && (
                              <>
                                <button
                                  onClick={() => updateLeadStatus(lead.id, 'closed')}
                                  className="text-xs px-2.5 py-1 rounded-md bg-[rgba(34,197,94,0.10)] text-[#15803D] font-medium hover:bg-[rgba(34,197,94,0.20)] transition-colors"
                                >
                                  Won
                                </button>
                                <button
                                  onClick={() => updateLeadStatus(lead.id, 'lost')}
                                  className="text-xs px-2.5 py-1 rounded-md bg-[rgba(239,68,68,0.08)] text-[#DC2626] font-medium hover:bg-[rgba(239,68,68,0.15)] transition-colors"
                                >
                                  Lost
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => deleteLead(lead.id)}
                              className="text-xs px-2.5 py-1 rounded-md text-[#5B6472] hover:text-[#DC2626] hover:bg-[rgba(239,68,68,0.05)] transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Intake Table */}
        {activeTab === 'intake' && (
          <div className="bg-white rounded-xl border border-[rgba(19,22,27,0.08)] overflow-hidden">
            {intakes.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#5B6472]">No intake submissions yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F7F5F0] text-[#5B6472] text-xs uppercase tracking-wider">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Name</th>
                      <th className="text-left px-4 py-3 font-semibold">Contact</th>
                      <th className="text-left px-4 py-3 font-semibold">Coverage</th>
                      <th className="text-left px-4 py-3 font-semibold">Status</th>
                      <th className="text-left px-4 py-3 font-semibold">Notes</th>
                      <th className="text-left px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(19,22,27,0.06)]">
                    {intakes.map((intake) => (
                      <tr key={intake.id} className="hover:bg-[rgba(19,22,27,0.02)]">
                        <td className="px-4 py-3 font-medium text-[#13161B]">
                          {intake.first_name} {intake.last_name}
                        </td>
                        <td className="px-4 py-3 text-[#5B6472]">
                          <div>{intake.email}</div>
                          <div className="text-xs">{intake.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-[#5B6472]">
                          {(intake.coverage_types || []).join(', ')}
                        </td>
                        <td className="px-4 py-3">{statusBadge(intake.status)}</td>
                        <td className="px-4 py-3">
                          <textarea
                            defaultValue={intake.internal_notes || ''}
                            onBlur={(e) => updateIntakeNotes(intake.id, e.target.value)}
                            className="w-40 px-2 py-1.5 rounded-lg bg-[#F7F5F0] border border-[rgba(19,22,27,0.10)] text-xs outline-none focus:border-[#2DD4BF] resize-none"
                            rows={2}
                            placeholder="Add notes..."
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 flex-wrap">
                            {intake.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateIntakeStatus(intake.id, 'approved')}
                                  className="text-xs px-2.5 py-1 rounded-md bg-[rgba(34,197,94,0.10)] text-[#15803D] font-medium hover:bg-[rgba(34,197,94,0.20)] transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateIntakeStatus(intake.id, 'declined')}
                                  className="text-xs px-2.5 py-1 rounded-md bg-[rgba(239,68,68,0.08)] text-[#DC2626] font-medium hover:bg-[rgba(239,68,68,0.15)] transition-colors"
                                >
                                  Decline
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => deleteIntake(intake.id)}
                              className="text-xs px-2.5 py-1 rounded-md text-[#5B6472] hover:text-[#DC2626] hover:bg-[rgba(239,68,68,0.05)] transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
