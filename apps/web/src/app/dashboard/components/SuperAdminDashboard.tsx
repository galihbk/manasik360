'use client';

import React, { useState, useEffect } from 'react';
import { ApiClient } from '@bahrain/api-client';
import { 
  Building2, 
  Users, 
  Ticket, 
  TrendingUp, 
  DollarSign, 
  Loader2, 
  ShieldAlert,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>({ totalTenants: 0, totalUsers: 0, totalVouchers: 0, totalRevenue: 0 });
  const [hajjPrice, setHajjPrice] = useState<number>(100000);
  const [umrahPrice, setUmrahPrice] = useState<number>(100000);
  
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, pricesRes] = await Promise.all([
        client.getSuperAdminStats(),
        client.getVoucherPrices()
      ]);

      if (statsRes && statsRes.success) setStats(statsRes.stats);
      if (pricesRes) {
        setHajjPrice(pricesRes.hajj || 100000);
        setUmrahPrice(pricesRes.umroh || 100000);
      }
    } catch (e: any) {
      console.error(e);
      showToast('Gagal memuat data dari server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdatePrice = async (packageType: 'hajj' | 'umroh', price: number) => {
    setActionLoading(true);
    try {
      const res = await client.updateSuperAdminVoucherPrice(packageType, price);
      if (res && res.success) {
        showToast(`Harga paket ${packageType === 'hajj' ? 'Haji' : 'Umrah'} berhasil diubah.`);
        fetchData();
      } else {
        showToast('Gagal mengubah harga paket.', 'error');
      }
    } catch (e) {
      showToast('Terjadi kesalahan koneksi.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Sinkronisasi Data Super Admin...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full space-y-8 bg-slate-50 min-h-screen">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border text-xs font-bold transition-all ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-655" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-red-100 text-red-850 rounded-full">
            Console Super Admin
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">Dasbor Bahrain Global</h1>
          <p className="text-xs text-slate-400 mt-1">Platform terpusat pengawasan multi-tenant, pengguna, lisensi, dan tarif.</p>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Biro (Tenant)</span>
            <Building2 className="w-8 h-8 text-blue-600 bg-blue-50 p-1.5 rounded-lg" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-4">{stats.totalTenants}</p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Aktif di sistem</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengguna</span>
            <Users className="w-8 h-8 text-indigo-600 bg-indigo-50 p-1.5 rounded-lg" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-4">{stats.totalUsers}</p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-2">
            <span>Termasuk Jemaah & Admin Biro</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Voucher</span>
            <Ticket className="w-8 h-8 text-emerald-600 bg-emerald-50 p-1.5 rounded-lg" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-4">{stats.totalVouchers}</p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-2">
            <span>Dibuat lintas tenant</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pendapatan</span>
            <DollarSign className="w-8 h-8 text-amber-600 bg-amber-50 p-1.5 rounded-lg" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-4.5">{formatCurrency(stats.totalRevenue)}</p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 mt-2.5">
            <span>Penjualan voucher berbayar</span>
          </div>
        </div>
      </div>

      {/* OVERVIEW & GENERAL CONFIG */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Voucher Prices Configuration */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Pengaturan Harga Voucher</h2>
            <p className="text-xs text-slate-400 mt-1">Ubah harga satuan voucher yang ditagihkan kepada Biro/Agensi.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Harga Voucher Haji</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rp</span>
                  <input 
                    type="number"
                    value={hajjPrice}
                    onChange={(e) => setHajjPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => handleUpdatePrice('hajj', hajjPrice)}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-1.5 bg-[#1e40af] hover:bg-blue-800 text-white text-[10px] font-bold px-3 py-2 rounded-md transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" /> Simpan
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Harga Voucher Umrah</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rp</span>
                  <input 
                    type="number"
                    value={umrahPrice}
                    onChange={(e) => setUmrahPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-blue-650 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => handleUpdatePrice('umroh', umrahPrice)}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-1.5 bg-[#1e40af] hover:bg-blue-800 text-white text-[10px] font-bold px-3 py-2 rounded-md transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" /> Simpan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Super Admin Info Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm text-white flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-flex p-2 bg-red-500/10 rounded-lg text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-200">Hak Akses Super Admin</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Sebagai Super Admin, Anda memiliki hak penuh untuk merekayasa data, mendaftarkan biro perjalanan (tenant), dan menentukan tarif belajar.
                Harap berhati-hati saat mengubah konfigurasi tarif global demi kestabilan portal transaksi.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 mt-6 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Bahrain Virtual V2</span>
            <span className="text-emerald-400">Online & Secured</span>
          </div>
        </div>
      </div>
    </div>
  );
}
