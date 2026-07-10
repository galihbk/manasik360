'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@bahrain/api-client';
import { 
  Ticket, 
  Loader2, 
  Search, 
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  CreditCard
} from 'lucide-react';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function VouchersPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState('Learner');
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Search query
  const [voucherSearch, setVoucherSearch] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPackageType, setNewPackageType] = useState('hajj');
  const [newMaxUses, setNewMaxUses] = useState(10);
  const [newDescription, setNewDescription] = useState('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchVouchers = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch user role first
      const profile = await client.getProfile();
      let normalizedRole = 'Learner';
      if (profile && profile.role) {
        normalizedRole = profile.role === 'ORG_ADMIN' || profile.role === 'ORG ADMIN' 
          ? 'Org Admin' 
          : profile.role === 'SUPER_ADMIN' || profile.role === 'SUPER ADMIN'
            ? 'Super Admin'
            : profile.role;
        setRole(normalizedRole);
      }

      // 2. Fetch vouchers based on role
      if (normalizedRole === 'Super Admin') {
        const res = await client.getSuperAdminVouchers();
        if (Array.isArray(res)) {
          setVouchers(res);
        } else {
          setVouchers([]);
        }
      } else {
        // Biro (Org Admin) gets their vouchers from the Org Dashboard API
        const res = await client.getOrgDashboard();
        if (res && Array.isArray(res.vouchers)) {
          setVouchers(res.vouchers);
        } else {
          setVouchers([]);
        }
      }
    } catch (e: any) {
      console.error(e);
      showToast('Gagal memuat data voucher dari server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchVouchers();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const filteredVouchers = vouchers.filter(v => 
    v.code.toLowerCase().includes(voucherSearch.toLowerCase()) ||
    (v.tenant?.name || '').toLowerCase().includes(voucherSearch.toLowerCase()) ||
    (v.description || '').toLowerCase().includes(voucherSearch.toLowerCase())
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMaxUses < 1) {
      showToast('Jumlah kuota minimal adalah 1 jemaah', 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await client.createVoucher({
        packageType: newPackageType as 'hajj' | 'umroh',
        maxUses: newMaxUses,
        description: newDescription,
        isPaid: false // Saved directly to database with unpaid status first
      });

      if (res && res.success && res.voucher) {
        setIsModalOpen(false);
        router.push(`/dashboard/vouchers/checkout?voucherId=${res.voucher.id}`);
      } else {
        showToast(res.message || 'Gagal menyimpan pesanan voucher.', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan koneksi ke server.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSuperAdmin = role === 'Super Admin';

  return (
    <div className="p-8 w-full space-y-8 py-12 bg-slate-50 min-h-screen">
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
          <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-full ${
            isSuperAdmin ? 'bg-red-100 text-red-850' : 'bg-blue-100 text-blue-800'
          }`}>
            {isSuperAdmin ? 'Console Super Admin' : 'Portal Biro'}
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
            {isSuperAdmin ? 'Daftar Voucher Global' : 'Voucher Jemaah'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isSuperAdmin 
              ? 'Pantau seluruh kode voucher, kapasitas, penggunaan, dan status pembayaran dari semua tenant.' 
              : 'Kelola dan pesan kuota kode voucher belajar untuk jemaah Anda.'
            }</p>
        </div>

        {/* Action Button for Biro */}
        {!isSuperAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1e40af] hover:bg-blue-800 text-white rounded-lg text-xs font-extrabold shadow-sm transition-all sm:self-end"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Voucher Group</span>
          </button>
        )}
      </div>

      {/* Search and List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={isSuperAdmin ? "Cari kode voucher atau nama biro..." : "Cari kode voucher atau nama grup..."}
              value={voucherSearch}
              onChange={(e) => setVoucherSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-blue-650 focus:outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Memuat data voucher...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Kode Voucher</th>
                  {!isSuperAdmin && <th className="py-3 px-5">Deskripsi / Nama Grup</th>}
                  {isSuperAdmin && <th className="py-3 px-5">Milik Biro (Tenant)</th>}
                  <th className="py-3 px-5">Jenis Paket</th>
                  <th className="py-3 px-5 text-center">Kapasitas</th>
                  <th className="py-3 px-5 text-center">Terpakai</th>
                  <th className="py-3 px-5 text-right">Biaya Dibayar</th>
                  <th className="py-3 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredVouchers.length === 0 ? (
                  <tr>
                    <td colSpan={isSuperAdmin ? 7 : 8} className="py-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                      Voucher tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredVouchers.map((v) => {
                    const isPaid = v.pricePaid > 0;
                    return (
                      <tr key={v.id} className="hover:bg-slate-50/85 transition-colors">
                        <td className="py-3.5 px-5 font-mono font-bold text-[#1e40af]">{v.code}</td>
                        {!isSuperAdmin && <td className="py-3.5 px-5 font-bold text-slate-900">{v.description || 'Grup Manasik'}</td>}
                        {isSuperAdmin && <td className="py-3.5 px-5 font-bold text-slate-900">{v.tenant?.name || 'Bahrain Academy'}</td>}
                        <td className="py-3.5 px-5 uppercase tracking-wide">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v.packageType === 'hajj' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'}`}>
                            {v.packageType === 'hajj' ? 'Haji' : 'Umrah'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-center font-bold">{v.maxUses}</td>
                        <td className="py-3.5 px-5 text-center font-bold text-emerald-600">{v.currentUses}</td>
                        <td className="py-3.5 px-5 text-right font-mono font-bold">
                          {formatCurrency(isPaid ? v.pricePaid : (v.metadata?.totalPrice || 0))}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {isPaid ? 'Lunas' : 'Menunggu Bayar'}
                          </span>
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

      {/* Modal form to purchase group voucher */}
      {isModalOpen && mounted && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-6 relative overflow-hidden animate-fade-in">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#1e40af] mb-4">
              <Ticket className="w-5 h-5" />
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">Pesan Voucher Group</h3>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-450 block">Pilih Paket Belajar</label>
                <select 
                  value={newPackageType} 
                  onChange={(e) => setNewPackageType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-bold text-slate-800 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="hajj">Haji Premium (Rp 100.000 / Jemaah)</option>
                  <option value="umroh">Umrah Premium (Rp 100.000 / Jemaah)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-450 block">Jumlah Kuota (Jemaah)</label>
                <input 
                  type="number" 
                  min="1"
                  value={newMaxUses} 
                  onChange={(e) => setNewMaxUses(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-850 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-450 block">Deskripsi / Nama Rombongan</label>
                <input 
                  type="text" 
                  placeholder="Misal: Rombongan Haji Akbar 2026"
                  value={newDescription} 
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-850 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-extrabold transition-all disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 py-2.5 bg-[#1e40af] hover:bg-blue-800 text-white rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Ke Pembayaran</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
