'use client';

import React, { useState, useEffect } from 'react';
import { ApiClient } from '@bahrain/api-client';
import {
  Users, Search, Filter, Mail, ChevronDown, ChevronRight, Download
} from 'lucide-react';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function PilgrimsPage() {
  const [orgData, setOrgData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    client.getOrgDashboard()
      .then((data) => {
        if (data && !data.error) {
          setOrgData(data);
          // Auto-expand all groups
          const groups = groupPilgrims(data.pilgrims || []);
          const defaultExpanded: Record<string, boolean> = {};
          groups.forEach((g: any) => { defaultExpanded[g.key] = true; });
          setExpandedGroups(defaultExpanded);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pilgrimsList: any[] = orgData?.pilgrims || [];

  // Group pilgrims by parentVoucherId (rombongan)
  const groupPilgrims = (list: any[]) => {
    const groupMap = new Map<string, { key: string; label: string; packageType: string; pilgrims: any[] }>();

    list.forEach((p) => {
      const key = p.parentVoucherId || 'ungrouped';
      const label = p.groupDescription || p.parentVoucherCode || 'Rombongan';
      const packageType = p.packageType || 'hajj';
      if (!groupMap.has(key)) {
        groupMap.set(key, { key, label, packageType, pilgrims: [] });
      }
      groupMap.get(key)!.pilgrims.push(p);
    });

    return Array.from(groupMap.values());
  };

  const filtered = pilgrimsList.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const groups = groupPilgrims(filtered);

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      'Completed': 'bg-emerald-50 text-emerald-700',
      'In Progress': 'bg-amber-50 text-amber-700',
      'Not Started': 'bg-slate-100 text-slate-400',
    };
    const label: Record<string, string> = {
      'Completed': 'Selesai', 'In Progress': 'Belajar', 'Not Started': 'Belum Mulai',
    };
    return (
      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${map[status] || 'bg-slate-100 text-slate-400'}`}>
        {label[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50/50 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5" /> Manajemen Jemaah
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">Daftar Jemaah</h1>
          <p className="text-sm text-slate-400 mt-1">Kelola dan pantau seluruh jemaah yang terdaftar di biro Anda, dikelompokkan per rombongan.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-3 py-1.5 rounded-lg border border-emerald-200/60">
            {pilgrimsList.length} Total Jemaah
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau email jemaah..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-600 transition-all"
          >
            <option value="all">Semua Status</option>
            <option value="Completed">Selesai</option>
            <option value="In Progress">Sedang Belajar</option>
            <option value="Not Started">Belum Mulai</option>
          </select>
        </div>
      </div>

      {/* Grouped List */}
      {groups.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-16 text-center">
          <Users className="w-12 h-12 mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 text-sm font-semibold">Belum ada jemaah yang bergabung</p>
          <p className="text-slate-300 text-xs mt-1">Jemaah akan muncul di sini setelah mereka menukar kode voucher yang Anda bagikan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => {
            const isExpanded = !!expandedGroups[group.key];
            const isHajj = group.packageType === 'hajj';
            const completedCount = group.pilgrims.filter((p: any) => p.status === 'Completed').length;
            const inProgressCount = group.pilgrims.filter((p: any) => p.status === 'In Progress').length;

            return (
              <div key={group.key} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.key)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded
                      ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    }
                    <div className="text-left">
                      <h3 className="text-sm font-black text-slate-800">{group.label}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {group.pilgrims.length} jemaah &nbsp;·&nbsp;
                        <span className="text-emerald-600 font-bold">{completedCount} selesai</span>
                        {inProgressCount > 0 && <span className="text-amber-600 font-bold"> · {inProgressCount} belajar</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${isHajj ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {isHajj ? 'Haji' : 'Umrah'}
                    </span>
                    {/* Progress bar */}
                    <div className="hidden sm:flex items-center gap-2 min-w-[100px]">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-1.5 bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${group.pilgrims.length > 0 ? Math.round((completedCount / group.pilgrims.length) * 100) : 0}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {group.pilgrims.length > 0 ? Math.round((completedCount / group.pilgrims.length) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </button>

                {/* Pilgrim Rows */}
                {isExpanded && (
                  <div className="border-t border-slate-100">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="px-6 py-3">Nama Jemaah</th>
                          <th className="px-6 py-3">Progres</th>
                          <th className="px-6 py-3">Nilai Kuis</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Bergabung</th>
                          <th className="px-6 py-3">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                        {group.pilgrims.map((pilgrim: any) => (
                          <tr key={pilgrim.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center uppercase font-black text-xs shrink-0">
                                  {pilgrim.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-extrabold text-slate-800">{pilgrim.name}</div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{pilgrim.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-2 min-w-[120px]">
                                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${pilgrim.progress}%` }} />
                                </div>
                                <span className="font-mono text-slate-600 shrink-0 font-bold text-[10px]">{pilgrim.progress}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className={`font-mono font-bold ${pilgrim.avgQuizScore >= 80 ? 'text-emerald-600' : 'text-slate-500'}`}>
                                {pilgrim.avgQuizScore}%
                              </span>
                            </td>
                            <td className="px-6 py-3.5">{statusBadge(pilgrim.status)}</td>
                            <td className="px-6 py-3.5 text-slate-400 font-normal text-[10px]">
                              {new Date(pilgrim.joinedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="px-6 py-3.5">
                              <a
                                href={`mailto:${pilgrim.email}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:border-emerald-600 hover:text-emerald-700 transition-all"
                              >
                                <Mail className="w-3 h-3" />
                                Hubungi
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}

          {/* Footer summary */}
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 px-1">
            <span>Menampilkan {filtered.length} dari {pilgrimsList.length} jemaah dalam {groups.length} rombongan</span>
            <button className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors">
              <Download className="w-3 h-3" /> Ekspor CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
