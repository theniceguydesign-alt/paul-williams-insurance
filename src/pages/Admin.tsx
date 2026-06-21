import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/providers/trpc';
import {
  Users, MessageSquare, TrendingUp, Clock, ChevronLeft, ChevronRight,
  Search, Phone, Mail, Calendar, Shield, LogOut, ArrowUpRight,
  AlertCircle, FileText, BarChart3, Inbox, CheckCircle2
} from 'lucide-react';

const statusColors: Record<string, string> = {
  new: 'bg-secondary-50 text-secondary-700 border border-secondary-200',
  contacted: 'bg-primary-50 text-primary-700 border border-primary-200',
  quoted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  bound: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
  lost: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
};

const intakeStatusColors: Record<string, string> = {
  new: 'bg-secondary-50 text-secondary-700 border border-secondary-200',
  in_review: 'bg-primary-50 text-primary-700 border border-primary-200',
  submitted_to_carrier: 'bg-amber-50 text-amber-700 border border-amber-200',
  quoted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  bound: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
  declined: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
};

type Tab = 'overview' | 'leads' | 'intakes';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth({
    redirectOnUnauthenticated: true,
  });

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [leadsPage, setLeadsPage] = useState(1);
  const [leadsStatusFilter, setLeadsStatusFilter] = useState('');
  const [leadsSearch, setLeadsSearch] = useState('');
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
              <ChevronLeft size={18} />
              <span className="font-body text-sm font-medium">Back to Site</span>
            </button>
            <div className="w-px h-5 bg-neutral-200" />
            <span className="font-semibold text-neutral-900">Paul Williams <span className="text-primary-600">Dashboard</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-primary-600" />
              <span className="font-body text-sm font-medium text-neutral-900">{user?.name || 'Admin'}</span>
            </div>
            <button onClick={logout} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors" title="Logout">
              <LogOut size={18} className="text-neutral-600 hover:text-neutral-900" />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-neutral-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0">
            {[
              { id: 'overview' as Tab, label: 'Overview', icon: BarChart3 },
              { id: 'leads' as Tab, label: 'Quote Leads', icon: Users },
              { id: 'intakes' as Tab, label: 'Intake Forms', icon: FileText },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-body text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-neutral-900'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'overview' && (
          <>
            {/* Combined Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Leads */}
              <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                  <h3 className="font-semibold uppercase tracking-wide text-xs text-neutral-700">Recent Quote Leads</h3>
                  <button onClick={() => setActiveTab('leads')} className="text-primary-600 hover:text-primary-700 font-body text-xs font-medium">View All</button>
                </div>
                <div className="divide-y divide-neutral-200">
                  {leads.slice(0, 5).map(lead => (
                    <div key={lead.id} className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                      <div>
                        <p className="font-body text-sm font-medium text-neutral-900">{lead.fullName}</p>
                        <p className="font-body text-xs text-neutral-500">{lead.insuranceType} — {lead.email}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded font-medium ${statusColors[lead.status]}`}>{lead.status}</span>
                    </div>
                  ))}
                  {leads.length === 0 && <p className="px-6 py-8 text-center font-body text-sm text-neutral-500">No leads yet</p>}
                </div>
              </div>

              {/* Recent Intakes */}
              <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                  <h3 className="font-semibold uppercase tracking-wide text-xs text-neutral-700">Recent Intake Forms</h3>
                  <button onClick={() => setActiveTab('intakes')} className="text-primary-600 hover:text-primary-700 font-body text-xs font-medium">View All</button>
                </div>
                <div className="divide-y divide-neutral-200">
                  {intakes.slice(0, 5).map(intake => (
                    <div key={intake.id} className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                      <div>
                        <p className="font-body text-sm font-medium text-neutral-900">{intake.primaryNamedInsured}</p>
                        <p className="font-body text-xs text-neutral-500">{intake.linesIncluded} — {intake.email}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded font-medium ${intakeStatusColors[intake.status]}`}>{intake.status.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                  {intakes.length === 0 && <p className="px-6 py-8 text-center font-body text-sm text-neutral-500">No intake forms yet</p>}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ===== LEADS TAB ===== */}
        {activeTab === 'leads' && (
          <>
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                <StatCard label="Total Leads" value={stats.totalLeads} icon={<Users size={18} />} />
                <StatCard label="New" value={stats.newLeads} icon={<AlertCircle size={18} />} highlight />
                <StatCard label="Contacted" value={stats.contactedLeads} icon={<Phone size={18} />} />
                <StatCard label="Quoted" value={stats.quotedLeads} icon={<TrendingUp size={18} />} />
                <StatCard label="Bound" value={stats.boundLeads} icon={<Shield size={18} />} />
                <StatCard label="Unread Msgs" value={stats.unreadMessages} icon={<MessageSquare size={18} />} highlight={stats.unreadMessages > 0} />
              </div>
            )}

            {/* Leads Table */}
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-neutral-900">LEAD MANAGEMENT</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 md:flex-initial">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input type="text" value={leadsSearch} onChange={e => { setLeadsSearch(e.target.value); setLeadsPage(1); }}
                        placeholder="Search..." className="bg-neutral-50 border border-neutral-200 rounded-lg pl-10 pr-4 py-2 font-body text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 w-48" />
                    </div>
                    <select value={leadsStatusFilter} onChange={e => { setLeadsStatusFilter(e.target.value); setLeadsPage(1); }}
                      className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2 font-body text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-400 appearance-none cursor-pointer">
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
                  <thead className="bg-neutral-50">
                    <tr className="border-b border-neutral-200">
                      {['Name', 'Contact', 'Type', 'Status', 'Date', 'Actions'].map(h => (
                        <th key={h} className="text-left px-6 py-3 font-body text-xs font-semibold uppercase tracking-wide text-neutral-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {leadsLoading ? (
                      <tr><td colSpan={6} className="text-center py-12"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto" /></td></tr>
                    ) : leads.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12"><p className="font-body text-sm text-neutral-500">No leads match your filters.</p></td></tr>
                    ) : leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-body text-sm font-medium text-neutral-900">{lead.fullName}</p>
                          {lead.message && <p className="font-body text-xs text-neutral-500 mt-1 max-w-[200px] truncate">{lead.message}</p>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-neutral-600 hover:text-primary-600 transition-colors"><Mail size={12} /><span className="font-body text-xs">{lead.email}</span></a>
                            <a href={`tel:${lead.phone.replace(/\D/g, '')}`} className="flex items-center gap-1.5 text-neutral-600 hover:text-primary-600 transition-colors"><Phone size={12} /><span className="font-body text-xs">{lead.phone}</span></a>
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="font-body text-xs bg-primary-100 text-primary-700 px-2.5 py-1 rounded font-medium">{lead.insuranceType}</span></td>
                        <td className="px-6 py-4">
                          <select value={lead.status} onChange={e => updateLead.mutate({ id: lead.id, status: e.target.value as any })}
                            className={`font-body text-xs px-2.5 py-1 rounded font-medium cursor-pointer border-0 ${statusColors[lead.status]}`}>
                            <option value="new">New</option><option value="contacted">Contacted</option><option value="quoted">Quoted</option><option value="bound">Bound</option><option value="lost">Lost</option>
                          </select>
                        </td>
                        <td className="px-6 py-4"><span className="font-body text-xs text-neutral-500">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '-'}</span></td>
                        <td className="px-6 py-4">
                          <button onClick={() => { if (confirm('Delete this lead?')) deleteLead.mutate({ id: lead.id }); }}
                            className="font-body text-xs text-neutral-500 hover:text-secondary-600 transition-colors">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {leadsPagination && leadsPagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
                  <p className="font-body text-xs text-neutral-500">Showing {(leadsPage - 1) * 10 + 1} - {Math.min(leadsPage * 10, leadsPagination.total)} of {leadsPagination.total}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setLeadsPage(p => Math.max(1, p - 1))} disabled={leadsPage === 1}
                      className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={16} /></button>
                    <span className="font-body text-sm font-medium text-neutral-900 px-3">{leadsPage} / {leadsPagination.totalPages}</span>
                    <button onClick={() => setLeadsPage(p => Math.min(leadsPagination.totalPages, p + 1))} disabled={leadsPage === leadsPagination.totalPages}
                      className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronRight size={16} /></button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ===== INTAKES TAB ===== */}
        {activeTab === 'intakes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

              <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-neutral-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-neutral-900">INTAKE SUBMISSIONS</h2>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 md:flex-initial">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input type="text" value={intakesSearch} onChange={e => { setIntakesSearch(e.target.value); setIntakesPage(1); }}
                          placeholder="Search..." className="bg-neutral-50 border border-neutral-200 rounded-lg pl-10 pr-4 py-2 font-body text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 w-48" />
                      </div>
                      <select value={intakesStatusFilter} onChange={e => { setIntakesStatusFilter(e.target.value); setIntakesPage(1); }}
                        className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2 font-body text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-400 appearance-none cursor-pointer">
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
                    <thead className="bg-neutral-50">
                      <tr className="border-b border-neutral-200">
                        {['Named Insured', 'Contact', 'Lines', 'Status', 'Date', ''].map(h => (
                          <th key={h} className="text-left px-6 py-3 font-body text-xs font-semibold uppercase tracking-wide text-neutral-700">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {intakesLoading ? (
                        <tr><td colSpan={6} className="text-center py-12"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto" /></td></tr>
                      ) : intakes.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-12"><p className="font-body text-sm text-neutral-500">No intake forms yet.</p></td></tr>
                      ) : intakes.map(intake => (
                        <tr key={intake.id} onClick={() => setSelectedIntake(intake.id)}
                          className={`cursor-pointer transition-colors ${selectedIntake === intake.id ? 'bg-primary-50' : 'hover:bg-neutral-50'}`}>
                          <td className="px-6 py-4">
                            <p className="font-body text-sm font-medium text-neutral-900">{intake.primaryNamedInsured}</p>
                            {intake.occupation && <p className="font-body text-xs text-neutral-500">{intake.occupation}</p>}
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="font-body text-xs text-neutral-500 flex items-center gap-1"><Mail size={10} /> {intake.email}</p>
                              <p className="font-body text-xs text-neutral-500 flex items-center gap-1"><Phone size={10} /> {intake.phone}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4"><span className="font-body text-xs bg-primary-100 text-primary-700 px-2.5 py-1 rounded font-medium">{intake.linesIncluded}</span></td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded font-medium ${intakeStatusColors[intake.status]}`}>{intake.status.replace(/_/g, ' ')}</span>
                          </td>
                          <td className="px-6 py-4"><span className="font-body text-xs text-neutral-500">{intake.createdAt ? new Date(intake.createdAt).toLocaleDateString() : '-'}</span></td>
                          <td className="px-6 py-4">
                            <button onClick={e => { e.stopPropagation(); if (confirm('Delete?')) deleteIntake.mutate({ id: intake.id }); }}
                              className="font-body text-xs text-neutral-500 hover:text-secondary-600 transition-colors">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {intakesPagination && intakesPagination.totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
                    <p className="font-body text-xs text-neutral-500">Showing {(intakesPage - 1) * 10 + 1} - {Math.min(intakesPage * 10, intakesPagination.total)} of {intakesPagination.total}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setIntakesPage(p => Math.max(1, p - 1))} disabled={intakesPage === 1}
                        className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={16} /></button>
                      <span className="font-body text-sm font-medium text-neutral-900 px-3">{intakesPage} / {intakesPagination.totalPages}</span>
                      <button onClick={() => setIntakesPage(p => Math.min(intakesPagination.totalPages, p + 1))} disabled={intakesPage === intakesPagination.totalPages}
                        className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronRight size={16} /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Intake Detail Panel */}
            <div className="lg:col-span-1">
              {selectedIntake && selectedIntakeData?.data ? (
                <div className="bg-white border border-neutral-200 rounded-lg p-6 sticky top-32">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-neutral-900">INTAKE DETAIL</h3>
                    <button onClick={() => setSelectedIntake(null)} className="text-neutral-400 hover:text-neutral-900"><ChevronLeft size={16} /></button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="font-body text-xs font-semibold uppercase tracking-wide text-neutral-500">Named Insured</p>
                      <p className="font-body text-sm text-neutral-900 mt-1">{selectedIntakeData.data.primaryNamedInsured}</p>
                    </div>
                    <div>
                      <p className="font-body text-xs font-semibold uppercase tracking-wide text-neutral-500">Email</p>
                      <a href={`mailto:${selectedIntakeData.data.email}`} className="font-body text-sm text-primary-600 hover:text-primary-700 transition-colors mt-1">{selectedIntakeData.data.email}</a>
                    </div>
                    <div>
                      <p className="font-body text-xs font-semibold uppercase tracking-wide text-neutral-500">Phone</p>
                      <a href={`tel:${selectedIntakeData.data.phone.replace(/\D/g, '')}`} className="font-body text-sm text-primary-600 hover:text-primary-700 transition-colors mt-1">{selectedIntakeData.data.phone}</a>
                    </div>
                    {selectedIntakeData.data.dob && (
                      <div>
                        <p className="font-body text-xs font-semibold uppercase tracking-wide text-neutral-500">DOB</p>
                        <p className="font-body text-sm text-neutral-900 mt-1">{selectedIntakeData.data.dob}</p>
                      </div>
                    )}
                    {selectedIntakeData.data.occupation && (
                      <div>
                        <p className="font-body text-xs font-semibold uppercase tracking-wide text-neutral-500">Occupation</p>
                        <p className="font-body text-sm text-neutral-900 mt-1">{selectedIntakeData.data.occupation}</p>
                      </div>
                    )}
                    {selectedIntakeData.data.riskAddress && (
                      <div>
                        <p className="font-body text-xs font-semibold uppercase tracking-wide text-neutral-500">Risk Address</p>
                        <p className="font-body text-sm text-neutral-900 mt-1">{selectedIntakeData.data.riskAddress}</p>
                      </div>
                    )}
                    {selectedIntakeData.data.linesIncluded && (
                      <div>
                        <p className="font-body text-xs font-semibold uppercase tracking-wide text-neutral-500">Lines</p>
                        <p className="font-body text-sm text-neutral-900 mt-1">{selectedIntakeData.data.linesIncluded}</p>
                      </div>
                    )}

                    {/* Status */}
                    <div className="border-t border-neutral-200 pt-4">
                      <p className="font-body text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">Status</p>
                      <select
                        value={selectedIntakeData.data.status}
                        onChange={e => updateIntakeStatus.mutate({ id: selectedIntakeData.data!.id, status: e.target.value as any })}
                        className={`w-full font-body text-sm px-3 py-2 rounded cursor-pointer border-0 font-medium ${intakeStatusColors[selectedIntakeData.data.status]}`}
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
                      <div className="border-t border-neutral-200 pt-4">
                        <p className="font-body text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">Full Form Data</p>
                        <div className="bg-neutral-50 rounded-lg p-3 max-h-[300px] overflow-y-auto">
                          <pre className="font-mono text-xs text-neutral-600 whitespace-pre-wrap">
                            {JSON.stringify(selectedIntakeData.data.formData as Record<string, unknown>, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Internal Notes */}
                    <div className="border-t border-neutral-200 pt-4">
                      <p className="font-body text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">Internal Notes</p>
                      <textarea
                        defaultValue={selectedIntakeData.data.internalNotes || ''}
                        onBlur={e => { if (e.target.value !== (selectedIntakeData.data!.internalNotes || '')) addIntakeNotes.mutate({ id: selectedIntakeData.data!.id, notes: e.target.value }); }}
                        rows={3}
                        placeholder="Add your notes here..."
                        className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 font-body text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                      />
                    </div>

                    <div className="border-t border-neutral-200 pt-4">
                      <p className="font-body text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">Submitted</p>
                      <p className="font-body text-xs text-neutral-600 flex items-center gap-1">
                        <Calendar size={12} />
                        {selectedIntakeData.data.createdAt ? new Date(selectedIntakeData.data.createdAt).toLocaleString() : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center sticky top-32">
                  <FileText size={32} className="text-neutral-300 mx-auto mb-3" />
                  <p className="font-body text-sm text-neutral-500">Select an intake form to view details</p>
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
    <div className={`bg-white border rounded-lg p-4 ${highlight ? 'border-secondary-200 bg-secondary-50' : 'border-neutral-200'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={highlight ? 'text-secondary-600' : 'text-primary-600'}>{icon}</span>
        <span className="font-body text-xs font-semibold uppercase tracking-wide text-neutral-600">{label}</span>
      </div>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
    </div>
  );
}
