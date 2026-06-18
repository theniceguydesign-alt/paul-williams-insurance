import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/providers/trpc';
import {
  Users, MessageSquare, TrendingUp, Clock, ChevronLeft, ChevronRight,
  Search, Phone, Mail, Calendar, Shield, LogOut, ArrowUpRight,
  AlertCircle, FileText, BarChart3, Inbox
} from 'lucide-react';

const statusColors: Record<string, string> = {
  new: 'bg-crimson/20 text-crimson',
  contacted: 'bg-brand-blue/20 text-brand-blue',
  quoted: 'bg-emerald-500/20 text-emerald-400',
  bound: 'bg-emerald-600/20 text-emerald-500',
  lost: 'bg-gray-500/20 text-gray-400',
};

const intakeStatusColors: Record<string, string> = {
  new: 'bg-crimson/20 text-crimson',
  in_review: 'bg-brand-blue/20 text-brand-blue',
  submitted_to_carrier: 'bg-amber-500/20 text-amber-400',
  quoted: 'bg-emerald-500/20 text-emerald-400',
  bound: 'bg-emerald-600/20 text-emerald-500',
  declined: 'bg-gray-500/20 text-gray-400',
};

type Tab = 'overview' | 'leads' | 'intakes';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth({
    redirectOnUnauthenticated: true,
  });

  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Leads state
  const [leadsPage, setLeadsPage] = useState(1);
  const [leadsStatusFilter, setLeadsStatusFilter] = useState('');
  const [leadsSearch, setLeadsSearch] = useState('');

  // Intakes state
  const [intakesPage, setIntakesPage] = useState(1);
  const [intakesStatusFilter, setIntakesStatusFilter] = useState('');
  const [intakesSearch, setIntakesSearch] = useState('');
  const [selectedIntake, setSelectedIntake] = useState<number | null>(null);

  const { data: statsData } = trpc.stats.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: intakeStatsData } = trpc.intake.stats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: leadsData, isLoading: leadsLoading } = trpc.leads.list.useQuery(
    {
      page: leadsPage,
      limit: 10,
      status: leadsStatusFilter as 'new' | 'contacted' | 'quoted' | 'bound' | 'lost' | undefined,
      search: leadsSearch || undefined,
    },
    { enabled: isAuthenticated && (activeTab === 'leads' || activeTab === 'overview') }
  );

  const { data: intakesData, isLoading: intakesLoading } = trpc.intake.list.useQuery(
    {
      page: intakesPage,
      limit: 10,
      status: intakesStatusFilter as 'new' | 'in_review' | 'submitted_to_carrier' | 'quoted' | 'bound' | 'declined' | undefined,
      search: intakesSearch || undefined,
    },
    { enabled: isAuthenticated && (activeTab === 'intakes' || activeTab === 'overview') }
  );

  const { data: selectedIntakeData } = trpc.intake.getById.useQuery(
    { id: selectedIntake! },
    { enabled: !!selectedIntake && isAuthenticated }
  );

  const utils = trpc.useUtils();

  const updateLead = trpc.leads.update.useMutation({
    onSuccess: () => { utils.leads.list.invalidate(); utils.stats.get.invalidate(); },
  });

  const deleteLead = trpc.leads.delete.useMutation({
    onSuccess: () => { utils.leads.list.invalidate(); utils.stats.get.invalidate(); },
  });

  const updateIntakeStatus = trpc.intake.updateStatus.useMutation({
    onSuccess: () => { utils.intake.list.invalidate(); utils.intake.stats.invalidate(); },
  });

  const addIntakeNotes = trpc.intake.addNotes.useMutation({
    onSuccess: () => { utils.intake.getById.invalidate(); utils.intake.list.invalidate(); },
  });

  const deleteIntake = trpc.intake.delete.useMutation({
    onSuccess: () => { utils.intake.list.invalidate(); utils.intake.stats.invalidate(); setSelectedIntake(null); },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const stats = statsData?.data;
  const intakeStats = intakeStatsData?.data;
  const leads = leadsData?.data?.leads ?? [];
  const leadsPagination = leadsData?.data?.pagination;
  const intakes = intakesData?.data?.submissions ?? [];
  const intakesPagination = intakesData?.data?.pagination;

  return (
    <div className="min-h-screen bg-void">
      {/* Header */}
      <header className="bg-midnight border-b border-dark-mist sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-mist hover:text-[#F0F2F5] transition-colors">
              <ChevronLeft size={18} />
              <span className="font-body text-sm">Back to Site</span>
            </button>
            <div className="w-px h-6 bg-dark-mist" />
            <span className="font-display text-xl text-[#F0F2F5]">PW<span className="text-crimson">.</span> DASHBOARD</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-brand-blue" />
              <span className="font-body text-sm text-[#F0F2F5]">{user?.name || 'Admin'}</span>
            </div>
            <button onClick={logout} className="flex items-center gap-2 text-mist hover:text-crimson transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-midnight border-b border-dark-mist">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex gap-0">
            {[
              { id: 'overview' as Tab, label: 'Overview', icon: BarChart3 },
              { id: 'leads' as Tab, label: 'Quote Leads', icon: Users },
              { id: 'intakes' as Tab, label: 'Intake Forms', icon: FileText },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-body text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-crimson text-[#F0F2F5]'
                    : 'border-transparent text-mist hover:text-[#F0F2F5]'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'overview' && (
          <>
            {/* Combined Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
              <StatCard label="Total Leads" value={stats?.totalLeads ?? 0} icon={<Users size={18} />} />
              <StatCard label="New Leads" value={stats?.newLeads ?? 0} icon={<AlertCircle size={18} />} highlight />
              <StatCard label="Bound Leads" value={stats?.boundLeads ?? 0} icon={<Shield size={18} />} />
              <StatCard label="Unread Msgs" value={stats?.unreadMessages ?? 0} icon={<Inbox size={18} />} highlight={(stats?.unreadMessages ?? 0) > 0} />
              <StatCard label="Total Intakes" value={intakeStats?.total ?? 0} icon={<FileText size={18} />} />
              <StatCard label="New Intakes" value={intakeStats?.new ?? 0} icon={<AlertCircle size={18} />} highlight />
              <StatCard label="In Review" value={intakeStats?.inReview ?? 0} icon={<Clock size={18} />} />
              <StatCard label="Bound Intakes" value={intakeStats?.bound ?? 0} icon={<CheckCircle2 size={18} />} />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Leads */}
              <div className="bg-midnight border border-dark-mist rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-dark-mist flex items-center justify-between">
                  <h3 className="font-body text-xs uppercase tracking-[2px] text-mist">Recent Quote Leads</h3>
                  <button onClick={() => setActiveTab('leads')} className="text-brand-blue hover:text-[#F0F2F5] font-body text-xs">View All</button>
                </div>
                <div className="divide-y divide-dark-mist">
                  {leads.slice(0, 5).map(lead => (
                    <div key={lead.id} className="px-6 py-3 flex items-center justify-between">
                      <div>
                        <p className="font-body text-sm text-[#F0F2F5]">{lead.fullName}</p>
                        <p className="font-body text-xs text-mist">{lead.insuranceType} — {lead.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded font-body ${statusColors[lead.status]}`}>{lead.status}</span>
                    </div>
                  ))}
                  {leads.length === 0 && <p className="px-6 py-8 text-center font-body text-sm text-mist">No leads yet</p>}
                </div>
              </div>

              {/* Recent Intakes */}
              <div className="bg-midnight border border-dark-mist rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-dark-mist flex items-center justify-between">
                  <h3 className="font-body text-xs uppercase tracking-[2px] text-mist">Recent Intake Forms</h3>
                  <button onClick={() => setActiveTab('intakes')} className="text-brand-blue hover:text-[#F0F2F5] font-body text-xs">View All</button>
                </div>
                <div className="divide-y divide-dark-mist">
                  {intakes.slice(0, 5).map(intake => (
                    <div key={intake.id} className="px-6 py-3 flex items-center justify-between">
                      <div>
                        <p className="font-body text-sm text-[#F0F2F5]">{intake.primaryNamedInsured}</p>
                        <p className="font-body text-xs text-mist">{intake.linesIncluded} — {intake.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded font-body ${intakeStatusColors[intake.status]}`}>{intake.status.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                  {intakes.length === 0 && <p className="px-6 py-8 text-center font-body text-sm text-mist">No intake forms yet</p>}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ===== LEADS TAB ===== */}
        {activeTab === 'leads' && (
          <>
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <StatCard label="Total Leads" value={stats.totalLeads} icon={<Users size={18} />} />
                <StatCard label="New" value={stats.newLeads} icon={<AlertCircle size={18} />} highlight />
                <StatCard label="Contacted" value={stats.contactedLeads} icon={<Phone size={18} />} />
                <StatCard label="Quoted" value={stats.quotedLeads} icon={<TrendingUp size={18} />} />
                <StatCard label="Bound" value={stats.boundLeads} icon={<Shield size={18} />} />
                <StatCard label="Unread Msgs" value={stats.unreadMessages} icon={<MessageSquare size={18} />} highlight={stats.unreadMessages > 0} />
              </div>
            )}

            {/* Leads Table */}
            <div className="bg-midnight border border-dark-mist rounded-lg overflow-hidden">
              <div className="p-6 border-b border-dark-mist">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="font-display text-2xl text-[#F0F2F5]">LEAD MANAGEMENT</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist" />
                      <input type="text" value={leadsSearch} onChange={e => { setLeadsSearch(e.target.value); setLeadsPage(1); }}
                        placeholder="Search..." className="bg-void border border-dark-mist rounded-lg pl-10 pr-4 py-2 font-body text-sm text-[#F0F2F5] placeholder:text-mist/40 focus:outline-none focus:border-brand-blue w-48" />
                    </div>
                    <select value={leadsStatusFilter} onChange={e => { setLeadsStatusFilter(e.target.value); setLeadsPage(1); }}
                      className="bg-void border border-dark-mist rounded-lg px-4 py-2 font-body text-sm text-[#F0F2F5] focus:outline-none focus:border-brand-blue appearance-none cursor-pointer">
                      <option value="">All Status</option>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                      <option value="bound">Bound</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-mist">
                      {['Name', 'Contact', 'Type', 'Status', 'Date', 'Actions'].map(h => (
                        <th key={h} className="text-left px-6 py-3 font-body text-[11px] uppercase tracking-[2px] text-mist">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leadsLoading ? (
                      <tr><td colSpan={6} className="text-center py-12"><div className="w-6 h-6 border-2 border-crimson border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
                    ) : leads.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12"><p className="font-body text-mist">No leads match your filters.</p></td></tr>
                    ) : leads.map(lead => (
                      <tr key={lead.id} className="border-b border-dark-mist hover:bg-void/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-body text-sm text-[#F0F2F5] font-medium">{lead.fullName}</p>
                          {lead.message && <p className="font-body text-xs text-mist mt-1 max-w-[200px] truncate">{lead.message}</p>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-mist hover:text-brand-blue transition-colors"><Mail size={12} /><span className="font-body text-xs">{lead.email}</span></a>
                            <a href={`tel:${lead.phone.replace(/\D/g, '')}`} className="flex items-center gap-1.5 text-mist hover:text-brand-blue transition-colors"><Phone size={12} /><span className="font-body text-xs">{lead.phone}</span></a>
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="font-body text-xs text-brand-blue bg-brand-blue/10 px-2 py-1 rounded">{lead.insuranceType}</span></td>
                        <td className="px-6 py-4">
                          <select value={lead.status} onChange={e => updateLead.mutate({ id: lead.id, status: e.target.value as any })}
                            className={`font-body text-xs px-2 py-1 rounded cursor-pointer border-0 ${statusColors[lead.status]}`}>
                            <option value="new">New</option><option value="contacted">Contacted</option><option value="quoted">Quoted</option><option value="bound">Bound</option><option value="lost">Lost</option>
                          </select>
                        </td>
                        <td className="px-6 py-4"><span className="font-body text-xs text-mist">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '-'}</span></td>
                        <td className="px-6 py-4">
                          <button onClick={() => { if (confirm('Delete this lead?')) deleteLead.mutate({ id: lead.id }); }}
                            className="font-body text-xs text-mist hover:text-crimson transition-colors">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {leadsPagination && leadsPagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-dark-mist flex items-center justify-between">
                  <p className="font-body text-xs text-mist">Showing {(leadsPage - 1) * 10 + 1} - {Math.min(leadsPage * 10, leadsPagination.total)} of {leadsPagination.total}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setLeadsPage(p => Math.max(1, p - 1))} disabled={leadsPage === 1}
                      className="p-2 rounded-lg border border-dark-mist text-mist hover:text-[#F0F2F5] disabled:opacity-30 transition-colors"><ChevronLeft size={16} /></button>
                    <span className="font-body text-sm text-[#F0F2F5] px-3">{leadsPage} / {leadsPagination.totalPages}</span>
                    <button onClick={() => setLeadsPage(p => Math.min(leadsPagination.totalPages, p + 1))} disabled={leadsPage === leadsPagination.totalPages}
                      className="p-2 rounded-lg border border-dark-mist text-mist hover:text-[#F0F2F5] disabled:opacity-30 transition-colors"><ChevronRight size={16} /></button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ===== INTAKES TAB ===== */}
        {activeTab === 'intakes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Intake List */}
            <div className="lg:col-span-2">
              {intakeStats && (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                  <StatCard label="Total" value={intakeStats.total} icon={<FileText size={16} />} />
                  <StatCard label="New" value={intakeStats.new} icon={<AlertCircle size={16} />} highlight />
                  <StatCard label="In Review" value={intakeStats.inReview} icon={<Clock size={16} />} />
                  <StatCard label="Submitted" value={intakeStats.submittedToCarrier} icon={<ArrowUpRight size={16} />} />
                  <StatCard label="Quoted" value={intakeStats.quoted} icon={<TrendingUp size={16} />} />
                  <StatCard label="Bound" value={intakeStats.bound} icon={<Shield size={16} />} />
                </div>
              )}

              <div className="bg-midnight border border-dark-mist rounded-lg overflow-hidden">
                <div className="p-6 border-b border-dark-mist">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="font-display text-2xl text-[#F0F2F5]">INTAKE SUBMISSIONS</h2>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist" />
                        <input type="text" value={intakesSearch} onChange={e => { setIntakesSearch(e.target.value); setIntakesPage(1); }}
                          placeholder="Search..." className="bg-void border border-dark-mist rounded-lg pl-10 pr-4 py-2 font-body text-sm text-[#F0F2F5] placeholder:text-mist/40 focus:outline-none focus:border-brand-blue w-48" />
                      </div>
                      <select value={intakesStatusFilter} onChange={e => { setIntakesStatusFilter(e.target.value); setIntakesPage(1); }}
                        className="bg-void border border-dark-mist rounded-lg px-4 py-2 font-body text-sm text-[#F0F2F5] focus:outline-none focus:border-brand-blue appearance-none cursor-pointer">
                        <option value="">All Status</option>
                        <option value="new">New</option>
                        <option value="in_review">In Review</option>
                        <option value="submitted_to_carrier">Submitted to Carrier</option>
                        <option value="quoted">Quoted</option>
                        <option value="bound">Bound</option>
                        <option value="declined">Declined</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-mist">
                        {['Named Insured', 'Contact', 'Lines', 'Status', 'Date', ''].map(h => (
                          <th key={h} className="text-left px-6 py-3 font-body text-[11px] uppercase tracking-[2px] text-mist">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {intakesLoading ? (
                        <tr><td colSpan={6} className="text-center py-12"><div className="w-6 h-6 border-2 border-crimson border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
                      ) : intakes.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-12"><p className="font-body text-mist">No intake forms yet.</p></td></tr>
                      ) : intakes.map(intake => (
                        <tr key={intake.id} onClick={() => setSelectedIntake(intake.id)}
                          className={`border-b border-dark-mist cursor-pointer transition-colors ${selectedIntake === intake.id ? 'bg-brand-blue/10' : 'hover:bg-void/50'}`}>
                          <td className="px-6 py-4">
                            <p className="font-body text-sm text-[#F0F2F5] font-medium">{intake.primaryNamedInsured}</p>
                            {intake.occupation && <p className="font-body text-xs text-mist">{intake.occupation}</p>}
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="font-body text-xs text-mist flex items-center gap-1"><Mail size={10} /> {intake.email}</p>
                              <p className="font-body text-xs text-mist flex items-center gap-1"><Phone size={10} /> {intake.phone}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4"><span className="font-body text-xs text-brand-blue bg-brand-blue/10 px-2 py-1 rounded">{intake.linesIncluded}</span></td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2 py-1 rounded font-body ${intakeStatusColors[intake.status]}`}>{intake.status.replace(/_/g, ' ')}</span>
                          </td>
                          <td className="px-6 py-4"><span className="font-body text-xs text-mist">{intake.createdAt ? new Date(intake.createdAt).toLocaleDateString() : '-'}</span></td>
                          <td className="px-6 py-4">
                            <button onClick={e => { e.stopPropagation(); if (confirm('Delete?')) deleteIntake.mutate({ id: intake.id }); }}
                              className="font-body text-xs text-mist hover:text-crimson transition-colors">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {intakesPagination && intakesPagination.totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-dark-mist flex items-center justify-between">
                    <p className="font-body text-xs text-mist">Showing {(intakesPage - 1) * 10 + 1} - {Math.min(intakesPage * 10, intakesPagination.total)} of {intakesPagination.total}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setIntakesPage(p => Math.max(1, p - 1))} disabled={intakesPage === 1}
                        className="p-2 rounded-lg border border-dark-mist text-mist hover:text-[#F0F2F5] disabled:opacity-30 transition-colors"><ChevronLeft size={16} /></button>
                      <span className="font-body text-sm text-[#F0F2F5] px-3">{intakesPage} / {intakesPagination.totalPages}</span>
                      <button onClick={() => setIntakesPage(p => Math.min(intakesPagination.totalPages, p + 1))} disabled={intakesPage === intakesPagination.totalPages}
                        className="p-2 rounded-lg border border-dark-mist text-mist hover:text-[#F0F2F5] disabled:opacity-30 transition-colors"><ChevronRight size={16} /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Intake Detail Panel */}
            <div className="lg:col-span-1">
              {selectedIntake && selectedIntakeData?.data ? (
                <div className="bg-midnight border border-dark-mist rounded-lg p-6 sticky top-20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-xl text-[#F0F2F5]">INTAKE DETAIL</h3>
                    <button onClick={() => setSelectedIntake(null)} className="text-mist hover:text-[#F0F2F5]"><ChevronLeft size={16} /></button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[2px] text-mist">Named Insured</p>
                      <p className="font-body text-sm text-[#F0F2F5]">{selectedIntakeData.data.primaryNamedInsured}</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[2px] text-mist">Email</p>
                      <a href={`mailto:${selectedIntakeData.data.email}`} className="font-body text-sm text-brand-blue hover:underline">{selectedIntakeData.data.email}</a>
                    </div>
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[2px] text-mist">Phone</p>
                      <a href={`tel:${selectedIntakeData.data.phone.replace(/\D/g, '')}`} className="font-body text-sm text-brand-blue hover:underline">{selectedIntakeData.data.phone}</a>
                    </div>
                    {selectedIntakeData.data.dob && (
                      <div>
                        <p className="font-body text-[10px] uppercase tracking-[2px] text-mist">DOB</p>
                        <p className="font-body text-sm text-[#F0F2F5]">{selectedIntakeData.data.dob}</p>
                      </div>
                    )}
                    {selectedIntakeData.data.occupation && (
                      <div>
                        <p className="font-body text-[10px] uppercase tracking-[2px] text-mist">Occupation</p>
                        <p className="font-body text-sm text-[#F0F2F5]">{selectedIntakeData.data.occupation}</p>
                      </div>
                    )}
                    {selectedIntakeData.data.riskAddress && (
                      <div>
                        <p className="font-body text-[10px] uppercase tracking-[2px] text-mist">Risk Address</p>
                        <p className="font-body text-sm text-[#F0F2F5]">{selectedIntakeData.data.riskAddress}</p>
                      </div>
                    )}
                    {selectedIntakeData.data.linesIncluded && (
                      <div>
                        <p className="font-body text-[10px] uppercase tracking-[2px] text-mist">Lines</p>
                        <p className="font-body text-sm text-[#F0F2F5]">{selectedIntakeData.data.linesIncluded}</p>
                      </div>
                    )}

                    {/* Status */}
                    <div className="border-t border-dark-mist pt-4">
                      <p className="font-body text-[10px] uppercase tracking-[2px] text-mist mb-2">Status</p>
                      <select
                        value={selectedIntakeData.data.status}
                        onChange={e => updateIntakeStatus.mutate({ id: selectedIntakeData.data!.id, status: e.target.value as any })}
                        className={`w-full font-body text-sm px-3 py-2 rounded cursor-pointer border-0 ${intakeStatusColors[selectedIntakeData.data.status]}`}
                      >
                        <option value="new">New</option>
                        <option value="in_review">In Review</option>
                        <option value="submitted_to_carrier">Submitted to Carrier</option>
                        <option value="quoted">Quoted</option>
                        <option value="bound">Bound</option>
                        <option value="declined">Declined</option>
                      </select>
                    </div>

                    {/* Form Data */}
                    {!!selectedIntakeData.data.formData && (
                      <div className="border-t border-dark-mist pt-4">
                        <p className="font-body text-[10px] uppercase tracking-[2px] text-mist mb-2">Full Form Data</p>
                        <div className="bg-void rounded-lg p-3 max-h-[300px] overflow-y-auto">
                          <pre className="font-body text-xs text-mist whitespace-pre-wrap">
                            {JSON.stringify(selectedIntakeData.data.formData as Record<string, unknown>, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Internal Notes */}
                    <div className="border-t border-dark-mist pt-4">
                      <p className="font-body text-[10px] uppercase tracking-[2px] text-mist mb-2">Internal Notes</p>
                      <textarea
                        defaultValue={selectedIntakeData.data.internalNotes || ''}
                        onBlur={e => { if (e.target.value !== (selectedIntakeData.data!.internalNotes || '')) addIntakeNotes.mutate({ id: selectedIntakeData.data!.id, notes: e.target.value }); }}
                        rows={3}
                        placeholder="Add your notes here..."
                        className="w-full bg-void border border-dark-mist rounded-lg px-3 py-2 font-body text-xs text-[#F0F2F5] placeholder:text-mist/40 focus:outline-none focus:border-brand-blue resize-none"
                      />
                    </div>

                    <div className="border-t border-dark-mist pt-4">
                      <p className="font-body text-[10px] uppercase tracking-[2px] text-mist mb-1">Submitted</p>
                      <p className="font-body text-xs text-mist flex items-center gap-1">
                        <Calendar size={12} />
                        {selectedIntakeData.data.createdAt ? new Date(selectedIntakeData.data.createdAt).toLocaleString() : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-midnight border border-dark-mist rounded-lg p-8 text-center sticky top-20">
                  <FileText size={32} className="text-mist mx-auto mb-3" />
                  <p className="font-body text-sm text-mist">Select an intake form to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, highlight = false }: { label: string; value: number; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`bg-midnight border rounded-lg p-4 ${highlight ? 'border-crimson/30' : 'border-dark-mist'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={highlight ? 'text-crimson' : 'text-brand-blue'}>{icon}</span>
        <span className="font-body text-[10px] uppercase tracking-[2px] text-mist">{label}</span>
      </div>
      <p className="font-display text-2xl text-[#F0F2F5]">{value}</p>
    </div>
  );
}

function CheckCircle2({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
    </svg>
  );
}
