import { useEffect, useState } from 'react'
import { Shield, LogOut, Users, FileText, BarChart2, RefreshCw, ChevronDown, Download } from 'lucide-react'
import { supabase, type Lead, type IntakeSubmission } from '@/lib/supabase'

type Tab = 'overview' | 'leads' | 'intake'

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  contacted: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  quoted: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  closed: 'bg-green-500/20 text-green-300 border border-green-500/30',
  pending: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
  reviewed: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
}

export default function Admin() {
  const [tab, setTab] = useState<Tab>('overview')
  const [leads, setLeads] = useState<Lead[]>([])
  const [intakes, setIntakes] = useState<IntakeSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedIntake, setExpandedIntake] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserEmail(data.user.email || '')
    })
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    const [leadsRes, intakesRes] = await Promise.all([
      supabase.from('leads').select('*').order('created_at', { ascending: false }),
      supabase.from('intake_submissions').select('*').order('created_at', { ascending: false }),
    ])
    setLeads(leadsRes.data || [])
    setIntakes(intakesRes.data || [])
    setLoading(false)
  }

  const updateLeadStatus = async (id: string, status: string) => {
    await supabase.from('leads').update({ status }).eq('id', id)
    setLeads(ls => ls.map(l => l.id === id ? { ...l, status } : l))
  }

  const updateLeadNotes = async (id: string, notes: string) => {
    await supabase.from('leads').update({ notes }).eq('id', id)
  }

  const exportLeadsCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Coverage', 'Status', 'Message', 'Date']
    const rows = leads.map(l => [
      l.name, l.email, l.phone, l.coverage_type || '', l.status || '',
      (l.message || '').replace(/,/g, ';'),
      new Date(l.created_at || '').toLocaleDateString()
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click()
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const newLeads = leads.filter(l => l.status === 'new').length
  const newIntakes = intakes.filter(i => i.status === 'pending').length

  return (
    <div className="min-h-screen bg-[#080f1e]">
      {/* Header */}
      <div className="bg-[#0a1628] border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="text-[#c9a227]" size={22} />
            <span className="text-white font-bold">Paul Williams Insurance · Agent Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden sm:block">{userEmail}</span>
            <button onClick={fetchAll} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10">
              <RefreshCw size={16} />
            </button>
            <button onClick={signOut} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 rounded-xl p-1 w-fit">
          {([
            { key: 'overview', icon: BarChart2, label: 'Overview' },
            { key: 'leads', icon: Users, label: `Leads${newLeads > 0 ? ` (${newLeads} new)` : ''}` },
            { key: 'intake', icon: FileText, label: `Intake${newIntakes > 0 ? ` (${newIntakes} new)` : ''}` },
          ] as const).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === key ? 'bg-[#c9a227] text-[#0a1628]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-gray-400 text-center py-16">Loading...</div>
        )}

        {/* OVERVIEW */}
        {!loading && tab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Leads', value: leads.length, color: 'text-white' },
                { label: 'New Leads', value: newLeads, color: 'text-blue-300' },
                { label: 'Quoted', value: leads.filter(l => l.status === 'quoted').length, color: 'text-purple-300' },
                { label: 'Closed Won', value: leads.filter(l => l.status === 'closed').length, color: 'text-green-300' },
              ].map(stat => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-white font-semibold mb-4">Recent Leads</div>
                {leads.slice(0, 5).map(lead => (
                  <div key={lead.id} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                    <div>
                      <div className="text-white text-sm font-medium">{lead.name}</div>
                      <div className="text-gray-400 text-xs">{lead.coverage_type || 'No type'}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[lead.status || 'new']}`}>
                      {lead.status || 'new'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-white font-semibold mb-4">Intake Submissions</div>
                {intakes.slice(0, 5).map(intake => (
                  <div key={intake.id} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                    <div>
                      <div className="text-white text-sm font-medium">
                        {(intake.data as Record<string, string>).first_name} {(intake.data as Record<string, string>).last_name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {new Date(intake.created_at || '').toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[intake.status || 'pending']}`}>
                      {intake.status || 'pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LEADS */}
        {!loading && tab === 'leads' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-bold text-lg">{leads.length} Total Leads</h2>
              <button
                onClick={exportLeadsCSV}
                className="flex items-center gap-2 bg-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm hover:bg-white/20"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>
            <div className="space-y-3">
              {leads.map(lead => (
                <div key={lead.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-white font-semibold">{lead.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[lead.status || 'new']}`}>
                          {lead.status || 'new'}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm flex flex-wrap gap-3">
                        <a href={`tel:${lead.phone}`} className="hover:text-[#c9a227]">{lead.phone}</a>
                        <a href={`mailto:${lead.email}`} className="hover:text-[#c9a227]">{lead.email}</a>
                        {lead.coverage_type && <span className="text-gray-500">{lead.coverage_type}</span>}
                      </div>
                      {lead.message && (
                        <p className="text-gray-400 text-sm mt-2">{lead.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <div className="relative">
                        <select
                          value={lead.status || 'new'}
                          onChange={e => updateLeadStatus(lead.id!, e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm appearance-none focus:outline-none focus:border-[#c9a227]"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="quoted">Quoted</option>
                          <option value="closed">Closed</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" size={14} />
                      </div>
                      <input
                        type="text"
                        defaultValue={lead.notes || ''}
                        onBlur={e => updateLeadNotes(lead.id!, e.target.value)}
                        placeholder="Internal notes..."
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#c9a227]"
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-gray-600 text-xs">
                    {new Date(lead.created_at || '').toLocaleString()}
                  </div>
                </div>
              ))}
              {leads.length === 0 && (
                <div className="text-center py-16 text-gray-500">No leads yet. They'll appear here when someone submits the quote form.</div>
              )}
            </div>
          </div>
        )}

        {/* INTAKE */}
        {!loading && tab === 'intake' && (
          <div>
            <h2 className="text-white font-bold text-lg mb-6">{intakes.length} Intake Submissions</h2>
            <div className="space-y-3">
              {intakes.map(intake => {
                const d = intake.data as Record<string, string>
                return (
                  <div key={intake.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <button
                      className="w-full px-5 py-4 flex justify-between items-center"
                      onClick={() => setExpandedIntake(expandedIntake === intake.id ? null : intake.id!)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <div className="text-white font-semibold">{d.first_name} {d.last_name}</div>
                          <div className="text-gray-400 text-sm">{d.phone} · {d.email}</div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[intake.status || 'pending']}`}>
                          {intake.status || 'pending'}
                        </span>
                      </div>
                      <ChevronDown
                        className={`text-gray-400 transition-transform ${expandedIntake === intake.id ? 'rotate-180' : ''}`}
                        size={16}
                      />
                    </button>
                    {expandedIntake === intake.id && (
                      <div className="px-5 pb-5 border-t border-white/10 pt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          {Object.entries(intake.data as Record<string, unknown>)
                            .filter(([, v]) => v && String(v).length > 0 && !Array.isArray(v))
                            .map(([k, v]) => (
                              <div key={k}>
                                <div className="text-[#c9a227] text-xs uppercase mb-0.5">{k.replace(/_/g, ' ')}</div>
                                <div className="text-white text-sm">{String(v ?? '')}</div>
                              </div>
                            ))}
                          {Array.isArray((intake.data as Record<string, unknown>).coverage_types) && (
                            <div className="md:col-span-2">
                              <div className="text-[#c9a227] text-xs uppercase mb-1">Coverage Types</div>
                              <div className="flex flex-wrap gap-2">
                                {((intake.data as Record<string, unknown>).coverage_types as string[]).map(c => (
                                  <span key={c} className="bg-[#c9a227]/20 text-[#c9a227] text-xs px-2 py-1 rounded-full">{c}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex gap-2">
                          {['pending', 'reviewed', 'contacted'].map(s => (
                            <button
                              key={s}
                              onClick={async () => {
                                await supabase.from('intake_submissions').update({ status: s }).eq('id', intake.id)
                                setIntakes(is => is.map(i => i.id === intake.id ? { ...i, status: s } : i))
                              }}
                              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                                intake.status === s
                                  ? 'bg-[#c9a227] text-[#0a1628] border-[#c9a227]'
                                  : 'text-gray-400 border-white/20 hover:border-[#c9a227]'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        <div className="text-gray-600 text-xs mt-3">
                          Submitted: {new Date(intake.created_at || '').toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              {intakes.length === 0 && (
                <div className="text-center py-16 text-gray-500">No intake submissions yet.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
