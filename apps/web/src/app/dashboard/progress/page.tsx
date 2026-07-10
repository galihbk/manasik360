'use client';

import React, { useState, useEffect } from 'react';
import { ApiClient } from '@bahrain/api-client';
import {
  BarChart3, TrendingUp, Users, BookOpen, Award, AlertCircle
} from 'lucide-react';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function ProgressPage() {
  const [orgData, setOrgData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.getOrgDashboard()
      .then((data) => { if (data && !data.error) setOrgData(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pilgrims: any[] = orgData?.pilgrims || [];
  const total = pilgrims.length;
  const completed = pilgrims.filter(p => p.status === 'Completed').length;
  const inProgress = pilgrims.filter(p => p.status === 'In Progress').length;
  const notStarted = pilgrims.filter(p => p.status === 'Not Started').length;
  const avgProgress = total > 0 ? Math.round(pilgrims.reduce((a, p) => a + p.progress, 0) / total) : 0;
  const avgQuiz = total > 0 ? Math.round(pilgrims.reduce((a, p) => a + (p.avgQuizScore || 0), 0) / total) : 0;

  const scoreGroups = [
    { label: '90–100%', count: pilgrims.filter(p => p.avgQuizScore >= 90).length, color: 'bg-blue-500' },
    { label: '70–89%', count: pilgrims.filter(p => p.avgQuizScore >= 70 && p.avgQuizScore < 90).length, color: 'bg-amber-400' },
    { label: '50–69%', count: pilgrims.filter(p => p.avgQuizScore >= 50 && p.avgQuizScore < 70).length, color: 'bg-orange-400' },
    { label: '< 50%', count: pilgrims.filter(p => p.avgQuizScore < 50).length, color: 'bg-red-400' },
  ];

  const statCard = (icon: React.ReactNode, label: string, value: string | number, sub?: string, color = 'text-slate-900') => (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 bg-[#1e40af]/10 rounded-xl flex items-center justify-center text-[#1e40af] shrink-0">
        {icon}
      </div>
      <div>
        <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">{label}</span>
        <span className={`text-2xl font-black mt-0.5 block ${color}`}>{value}</span>
        {sub && <span className="text-[10px] text-slate-400 mt-0.5 block">{sub}</span>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-slate-200 mb-4" />
        <h2 className="text-lg font-bold text-slate-600">Belum ada data jemaah</h2>
        <p className="text-sm text-slate-400 mt-1">Bagikan voucher Anda agar jemaah bisa bergabung dan mulai belajar.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50/50 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200/60 pb-6">
        <span className="text-xs font-bold text-[#1e40af] uppercase tracking-widest flex items-center gap-1.5 mb-1">
          <BarChart3 className="w-3.5 h-3.5" /> Analitik Pembelajaran
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900">Progres Belajar Jemaah</h1>
        <p className="text-sm text-slate-400 mt-1">Ringkasan kesiapan belajar seluruh jemaah biro Anda.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCard(<Users className="w-6 h-6" />, 'Total Jemaah', `${total} Orang`)}
        {statCard(<TrendingUp className="w-6 h-6" />, 'Rata-rata Progres', `${avgProgress}%`, 'dari seluruh materi')}
        {statCard(<BookOpen className="w-6 h-6" />, 'Rata-rata Nilai Kuis', `${avgQuiz}%`, 'dari seluruh jemaah', avgQuiz >= 70 ? 'text-blue-700' : 'text-amber-700')}
        {statCard(<Award className="w-6 h-6" />, 'Jemaah Selesai', `${completed} Orang`, `${total > 0 ? Math.round((completed / total) * 100) : 0}% dari total`)}
      </div>

      {/* Status Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <h2 className="text-base font-extrabold text-slate-800">Distribusi Status Belajar</h2>
        <div className="space-y-4">
          {[
            { label: 'Selesai', count: completed, color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50' },
            { label: 'Sedang Belajar', count: inProgress, color: 'bg-amber-400', textColor: 'text-amber-700', bgColor: 'bg-amber-50' },
            { label: 'Belum Mulai', count: notStarted, color: 'bg-slate-200', textColor: 'text-slate-500', bgColor: 'bg-slate-50' },
          ].map((s) => {
            const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
            return (
              <div key={s.label} className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-600 w-28 shrink-0">{s.label}</span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-3 rounded-full transition-all duration-700 ${s.color}`} style={{ width: `${pct}%` }} />
                </div>
                <span className={`text-xs font-black w-20 text-right ${s.textColor}`}>{s.count} jemaah</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.bgColor} ${s.textColor} w-14 text-center shrink-0`}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz Score Distribution */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <h2 className="text-base font-extrabold text-slate-800">Distribusi Nilai Kuis</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {scoreGroups.map((g) => {
            const pct = total > 0 ? Math.round((g.count / total) * 100) : 0;
            return (
              <div key={g.label} className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                <div className={`w-12 h-12 ${g.color} rounded-full flex items-center justify-center text-white font-black text-sm mx-auto mb-2`}>
                  {g.count}
                </div>
                <p className="text-xs font-bold text-slate-700">{g.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{pct}% jemaah</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-pilgrim Progress Details */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-base font-extrabold text-slate-800">Detail Per Jemaah</h2>
          <p className="text-xs text-slate-400 mt-0.5">Sorted berdasarkan progres tertinggi</p>
        </div>
        <div className="divide-y divide-slate-100">
          {[...pilgrims].sort((a, b) => b.progress - a.progress).map((p) => (
            <div key={p.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/40 transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#1e40af]/10 text-[#1e40af] flex items-center justify-center font-black text-xs shrink-0">
                {p.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-800 truncate">{p.name}</span>
                  <span className="text-[10px] font-mono text-slate-500 ml-2 shrink-0">{p.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-2 rounded-full transition-all ${p.progress >= 80 ? 'bg-blue-500' : p.progress >= 40 ? 'bg-amber-400' : 'bg-slate-300'}`} style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400">Kuis</span>
                <span className={`block text-xs font-black ${p.avgQuizScore >= 80 ? 'text-blue-600' : 'text-slate-500'}`}>{p.avgQuizScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
