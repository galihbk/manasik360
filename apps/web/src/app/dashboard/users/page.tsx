'use client';

import React, { useState, useEffect } from 'react';
import { ApiClient } from '@bahrain/api-client';
import { 
  Users, 
  Loader2, 
  Search, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Search query
  const [userSearch, setUserSearch] = useState('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await client.getSuperAdminUsers();
      if (Array.isArray(res)) {
        setUsers(res);
      } else {
        setUsers([]);
      }
    } catch (e: any) {
      console.error(e);
      showToast('Gagal memuat data pengguna dari server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 w-full space-y-8 bg-slate-50 min-h-screen">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-55 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border text-xs font-bold transition-all ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-655" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-red-100 text-red-850 rounded-full">
            Console Super Admin
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">Daftar Pengguna Global</h1>
          <p className="text-xs text-slate-400 mt-1">Daftar seluruh pengguna platform, termasuk peran akun (Super Admin, Biro, Jemaah) dan asosiasi tenant.</p>
        </div>
      </div>

      {/* Search and List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama, email, atau peran..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-blue-650 focus:outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Memuat data pengguna...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Nama</th>
                  <th className="py-3 px-5">Email</th>
                  <th className="py-3 px-5">Peran</th>
                  <th className="py-3 px-5">Milik Tenant</th>
                  <th className="py-3 px-5">Tanggal Registrasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-bold uppercase tracking-wider">Pengguna tidak ditemukan</td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSuper = u.role === 'SUPER_ADMIN' || u.role === 'SUPER ADMIN';
                    const isOrg = u.role === 'ORG_ADMIN' || u.role === 'ORG ADMIN';
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/85 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-slate-900">{u.name}</td>
                        <td className="py-3.5 px-5 text-slate-550">{u.email}</td>
                        <td className="py-3.5 px-5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isSuper ? 'bg-red-100 text-red-800' : isOrg ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-650'
                          }`}>
                            {isSuper ? 'Super Admin' : isOrg ? 'Admin Biro' : 'Jemaah'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-bold text-slate-600">{u.tenant?.name || 'Global'}</td>
                        <td className="py-3.5 px-5 text-slate-400 font-semibold">
                          {new Date(u.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
