'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { sections } from '@/data/questions';
import { SingleResponse, MultiResponse, TextResponse, RankResponse, PercentageResponse } from '@/lib/types';
import { Lock, LogOut, RefreshCw, ChevronDown, ChevronRight, Trash2, Users, CheckCircle, Clock, BarChart3, Eye, Download } from 'lucide-react';

interface StoredSubmission {
  id: string;
  respondent: { name: string; email: string; role: string };
  responses: Record<string, any>;
  completionRate: number;
  submittedAt: string;
  storedAt: string;
}

function formatResponse(response: any, type: string): string {
  if (!response) return '— Not answered —';
  switch (type) {
    case 'single': {
      const r = response as SingleResponse;
      if (!r.selected) return '— Not answered —';
      if (r.selected === '__other__') return r.other || 'Other';
      return r.other ? `${r.selected} (Other: ${r.other})` : r.selected;
    }
    case 'multi': {
      const r = response as MultiResponse;
      if (!r.selected || r.selected.length === 0) return '— Not answered —';
      const items = r.selected.filter(s => s !== '__other__');
      if (r.selected.includes('__other__') && r.other) items.push(`Other: ${r.other}`);
      return items.join(', ');
    }
    case 'text': {
      const r = response as TextResponse;
      return r.text?.trim() || '— Not answered —';
    }
    case 'rank': {
      const r = response as RankResponse;
      if (!r.ranked || r.ranked.length === 0) return '— Not answered —';
      return r.ranked.map((item, i) => `#${i + 1} ${item}`).join(', ');
    }
    case 'percentage': {
      const r = response as PercentageResponse;
      if (!r.allocations || Object.keys(r.allocations).length === 0) return '— Not answered —';
      return Object.entries(r.allocations)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${k}: ${v}%`)
        .join(', ');
    }
    default: return '—';
  }
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/submissions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        setAuthed(false);
        setError('Invalid password');
        return;
      }
      const data = await res.json();
      setSubmissions(data.submissions || []);
      setTotal(data.total || 0);
    } catch {
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthToken(password);
    setAuthed(true);
    fetchSubmissions(password);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this submission permanently?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/submissions?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setSubmissions(prev => prev.filter(s => s.id !== id));
      setTotal(prev => prev - 1);
    } catch {
      alert('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const exportCSV = () => {
    if (submissions.length === 0) return;

    const allQuestions = sections.flatMap(s => s.questions);
    const headers = ['Name', 'Email', 'Role', 'Completion', 'Submitted At', ...allQuestions.map(q => q.text)];
    const rows = submissions.map(sub => {
      return [
        sub.respondent.name,
        sub.respondent.email,
        sub.respondent.role || '',
        `${sub.completionRate}%`,
        new Date(sub.submittedAt).toLocaleString(),
        ...allQuestions.map(q => formatResponse(sub.responses[q.id], q.type)),
      ];
    });

    const csvContent = [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facility-vision-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // LOGIN SCREEN
  if (!authed) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-6 bg-bg-primary">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-accent-cyan" />
            </div>
            <h1 className="font-heading text-xl tracking-wider uppercase text-text-primary mb-2">Admin Dashboard</h1>
            <p className="font-body text-text-secondary text-sm">Enter admin password to view submissions</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3.5 rounded-lg bg-bg-secondary border border-border
                text-text-primary font-body text-[15px] placeholder:text-text-tertiary
                focus:border-accent-cyan focus:shadow-glow-cyan focus:outline-none
                transition-all duration-200"
              autoFocus
            />
            {error && (
              <p className="text-accent-magenta text-sm font-body">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3.5 rounded-lg bg-accent-cyan/10 border border-accent-cyan
                text-accent-cyan font-heading text-sm tracking-[0.2em] uppercase
                hover:bg-accent-cyan/20 shadow-glow-cyan
                transition-all duration-200 active:scale-[0.98]"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD
  const avgCompletion = submissions.length > 0
    ? Math.round(submissions.reduce((sum, s) => sum + s.completionRate, 0) / submissions.length)
    : 0;
  const fullCompletions = submissions.filter(s => s.completionRate === 100).length;

  return (
    <div className="min-h-[100dvh] bg-bg-primary">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-bg-primary/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-sm md:text-base tracking-wider uppercase text-accent-cyan">
              Submissions Dashboard
            </h1>
            <span className="font-mono text-xs text-text-tertiary bg-bg-tertiary px-2 py-0.5 rounded">
              {total} total
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              disabled={submissions.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body
                text-accent-green border border-accent-green/30 bg-accent-green/5
                hover:bg-accent-green/10 transition-all duration-200
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={() => fetchSubmissions(authToken)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body
                text-text-secondary border border-border
                hover:text-accent-cyan hover:border-accent-cyan/30 transition-all duration-200"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => { setAuthed(false); setAuthToken(''); setSubmissions([]); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body
                text-text-tertiary hover:text-accent-magenta transition-all duration-200"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="glass-card rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-accent-cyan" />
              <span className="font-mono text-xs text-text-tertiary uppercase">Total</span>
            </div>
            <div className="font-mono text-2xl font-bold text-accent-cyan">{total}</div>
          </div>
          <div className="glass-card rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-accent-green" />
              <span className="font-mono text-xs text-text-tertiary uppercase">100% Complete</span>
            </div>
            <div className="font-mono text-2xl font-bold text-accent-green">{fullCompletions}</div>
          </div>
          <div className="glass-card rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={16} className="text-accent-cyan" />
              <span className="font-mono text-xs text-text-tertiary uppercase">Avg Completion</span>
            </div>
            <div className="font-mono text-2xl font-bold text-text-primary">{avgCompletion}%</div>
          </div>
          <div className="glass-card rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-text-secondary" />
              <span className="font-mono text-xs text-text-tertiary uppercase">Latest</span>
            </div>
            <div className="font-mono text-sm text-text-secondary">
              {submissions.length > 0
                ? new Date(submissions[0].submittedAt).toLocaleDateString()
                : '—'}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && submissions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-bg-tertiary flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-text-tertiary" />
            </div>
            <p className="font-body text-text-secondary mb-2">No submissions yet</p>
            <p className="font-body text-text-tertiary text-sm">Submissions will appear here as people complete the questionnaire.</p>
          </div>
        )}

        {/* Submissions List */}
        <div className="flex flex-col gap-3">
          {submissions.map((sub) => (
            <div key={sub.id} className="glass-card rounded-lg overflow-hidden">
              {/* Header Row */}
              <button
                onClick={() => toggleExpanded(sub.id)}
                className="w-full px-4 py-3.5 flex items-center justify-between gap-4 text-left
                  hover:bg-bg-tertiary/50 transition-colors duration-150"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {expanded.has(sub.id)
                    ? <ChevronDown size={16} className="text-accent-cyan flex-shrink-0" />
                    : <ChevronRight size={16} className="text-text-tertiary flex-shrink-0" />
                  }
                  <div className="min-w-0">
                    <div className="font-body text-text-primary text-[15px] font-medium truncate">
                      {sub.respondent.name}
                    </div>
                    <div className="font-mono text-xs text-text-secondary truncate">
                      {sub.respondent.email}
                      {sub.respondent.role && <span className="text-text-tertiary"> · {sub.respondent.role}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${
                    sub.completionRate === 100
                      ? 'text-accent-green bg-accent-green/10'
                      : sub.completionRate >= 50
                      ? 'text-accent-cyan bg-accent-cyan/10'
                      : 'text-accent-magenta bg-accent-magenta/10'
                  }`}>
                    {sub.completionRate}%
                  </span>
                  <span className="font-mono text-xs text-text-tertiary hidden sm:inline">
                    {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </button>

              {/* Expanded Details */}
              {expanded.has(sub.id) && (
                <div className="border-t border-border">
                  {/* Actions bar */}
                  <div className="px-4 py-2 bg-bg-tertiary/30 flex items-center justify-between">
                    <span className="font-mono text-xs text-text-tertiary">
                      ID: {sub.id}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(sub.id); }}
                      disabled={deleting === sub.id}
                      className="flex items-center gap-1 px-2 py-1 rounded text-xs font-body
                        text-accent-magenta/70 hover:text-accent-magenta hover:bg-accent-magenta/10
                        transition-all duration-150 disabled:opacity-30"
                    >
                      <Trash2 size={12} />
                      {deleting === sub.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>

                  {/* Responses by Section */}
                  <div className="px-4 py-4">
                    {sections.map((section) => {
                      const answered = section.questions.filter(q => {
                        const r = sub.responses[q.id];
                        if (!r) return false;
                        return formatResponse(r, q.type) !== '— Not answered —';
                      });
                      if (answered.length === 0) return null;

                      return (
                        <div key={section.id} className="mb-4 last:mb-0">
                          <div className="flex items-center gap-2 mb-2 pb-1 border-b border-border/50">
                            <span>{section.icon}</span>
                            <span className="font-heading text-xs tracking-wider uppercase text-accent-cyan">
                              {section.title}
                            </span>
                            <span className="font-mono text-[10px] text-text-tertiary">
                              {answered.length}/{section.questions.length}
                            </span>
                          </div>
                          <div className="flex flex-col gap-2 ml-1">
                            {section.questions.map((q) => {
                              const resp = sub.responses[q.id];
                              const formatted = formatResponse(resp, q.type);
                              if (formatted === '— Not answered —') return null;
                              return (
                                <div key={q.id} className="flex flex-col gap-0.5">
                                  <span className="font-body text-xs text-text-secondary">{q.text}</span>
                                  <span className="font-body text-sm text-text-primary pl-2 border-l-2 border-accent-cyan/30">
                                    {formatted}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
