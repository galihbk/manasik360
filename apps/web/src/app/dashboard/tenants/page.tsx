'use client';

import React, { useState, useEffect } from 'react';
import { ApiClient } from '@bahrain/api-client';
import { 
  Building2, 
  Plus, 
  Loader2, 
  Search, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Search query
  const [tenantSearch, setTenantSearch] = useState('');

  // Tenant form state
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantAdminName, setNewTenantAdminName] = useState('');
  const [newTenantAdminEmail, setNewTenantAdminEmail] = useState('');
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTenants = async () => {
    setIsLoading(true);
    try {
      const res = await client.getSuperAdminTenants();
      if (Array.isArray(res)) {
        setTenants(res);
      } else {
        setTenants([]);
      }
    } catch (e: any) {
      console.error(e);
      showToast('Gagal memuat data Biro dari server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName || !newTenantAdminName || !newTenantAdminEmail) {
      showToast('Harap isi semua kolom.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const res = await client.createSuperAdminTenant({
        name: newTenantName,
        adminName: newTenantAdminName,
        adminEmail: newTenantAdminEmail
      });

      if (res && res.success) {
        showToast(`Tenant Biro "${newTenantName}" berhasil dibuat!`);
        setNewTenantName('');
        setNewTenantAdminName('');
        setNewTenantAdminEmail('');
        setShowAddTenantModal(false);
        fetchTenants();
      } else {
        showToast('Gagal membuat Tenant Biro baru.', 'error');
      }
    } catch (e) {
      showToast('Terjadi kesalahan koneksi.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(tenantSearch.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 w-full space-y-8 bg-slate-50 min-h-screen">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-55 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border text-xs font-bold transition-all ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-650" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-red-100 text-red-850 rounded-full">
            Console Super Admin
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">Kelola Biro Perjalanan (Tenant)</h1>
          <p className="text-xs text-slate-400 mt-1">Daftarkan Biro, admin biro, dan pantau jumlah jemaah aktif mereka.</p>
        </div>
        <button
          onClick={() => setShowAddTenantModal(true)}
          className="inline-flex items-center gap-2 bg-[#1e40af] hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-md shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Registrasi Biro Baru
        </button>
      </div>

      {/* Search and List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama biro perjalanan..."
              value={tenantSearch}
              onChange={(e) => setTenantSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-blue-650 focus:outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Memuat daftar biro...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Nama Biro</th>
                  <th className="py-3 px-5">Admin Utama</th>
                  <th className="py-3 px-5 text-center">Total Jemaah</th>
                  <th className="py-3 px-5 text-center">Total Voucher</th>
                  <th className="py-3 px-5">Tanggal Dibuat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredTenants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-bold uppercase tracking-wider">Biro tidak ditemukan</td>
                  </tr>
                ) : (
                  filteredTenants.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/85 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-900">{t.name}</td>
                      <td className="py-3.5 px-5">
                        {t.users?.[0] ? (
                          <div>
                            <p className="font-bold text-slate-800">{t.users[0].name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{t.users[0].email}</p>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="py-3.5 px-5 text-center font-bold text-slate-850">{t._count?.users || 0}</td>
                      <td className="py-3.5 px-5 text-center font-bold text-slate-850">{t._count?.vouchers || 0}</td>
                      <td className="py-3.5 px-5 text-slate-400 font-semibold">
                        {new Date(t.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REGISTRATION MODAL */}
      {showAddTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-sm uppercase text-slate-900">Registrasi Biro & Tenant Baru</h3>
              <button 
                onClick={() => setShowAddTenantModal(false)}
                className="text-slate-400 hover:text-slate-900 text-xs font-bold"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Nama Biro Perjalanan</label>
                <input 
                  type="text" 
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  placeholder="e.g. Al-Amin Tour & Travel"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-blue-650 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Nama Administrator Utama</label>
                <input 
                  type="text" 
                  value={newTenantAdminName}
                  onChange={(e) => setNewTenantAdminName(e.target.value)}
                  placeholder="e.g. H. Muhammad"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-blue-650 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Email Administrator Utama</label>
                <input 
                  type="email" 
                  value={newTenantAdminEmail}
                  onChange={(e) => setNewTenantAdminEmail(e.target.value)}
                  placeholder="e.g. muhammad@alamin.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-blue-650 focus:outline-none"
                  required
                />
                <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">
                  Sistem akan otomatis mengaitkan admin ini ke tenant baru dengan hak administrator biro.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setShowAddTenantModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-md"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-[#1e40af] hover:bg-blue-800 text-white rounded-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Buat Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
