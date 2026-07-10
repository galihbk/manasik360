'use client';

import React, { useState, useEffect } from 'react';
import { en, id, ar } from '@bahrain/localization';
import { ApiClient } from '@bahrain/api-client';
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  FileText, 
  BookOpen, 
  Award, 
  Calendar, 
  Shield, 
  CheckCircle, 
  Edit3, 
  Save,
  CheckCircle2,
  X
} from 'lucide-react';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function ProfilePage() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [role, setRole] = useState('');
  const [joinedDate, setJoinedDate] = useState('');
  const [lang, setLang] = useState('en');

  // Subscription states
  const [planActive, setPlanActive] = useState(false);
  const [planName, setPlanName] = useState('Free Trial');
  const [activePackages, setActivePackages] = useState<string[]>([]);
  const [certificatesCount, setCertificatesCount] = useState(0);

  // Editable/Customizable states (persisted locally)
  const [phone, setPhone] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Translation helpers
  const tMap: Record<string, any> = { en, id, ar };
  const t = tMap[lang] || en;
  const d = t.dashboard || en.dashboard;

  useEffect(() => {
    const savedLang = localStorage.getItem('bahrain_lang') || 'en';
    setLang(savedLang);

    // Fetch user profile from NestJS API
    client.getProfile()
      .then((data) => {
        if (data) {
          setUserName(data.name || 'Ahmad Fauzi');
          setEmail(data.email || 'learner@bahrain.com');
          setRole(data.role || 'Learner');
          setTenantName(data.tenantName || 'Bahrain Virtual Academy');
          
          setPhone(data.phone || '');
          setPassportNumber(data.passportNumber || '');
          setAddress(data.address || '');
          setBio(data.bio || '');

          if (data.createdAt) {
            const dateObj = new Date(data.createdAt);
            setJoinedDate(dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }));
          } else {
            setJoinedDate('8 Juli 2026');
          }
        }
      })
      .catch(() => {
        const storedName = localStorage.getItem('bahrain_user_name');
        const storedRole = localStorage.getItem('bahrain_user_role');
        const storedOrg = localStorage.getItem('bahrain_org_name');
        if (storedName) setUserName(storedName);
        if (storedRole) setRole(storedRole);
        if (storedOrg) setTenantName(storedOrg);
        setJoinedDate('8 Juli 2026');
      });

    // Fetch subscription status
    client.getSubscription()
      .then((sub: any) => {
        if (sub) {
          setPlanActive(sub.active);
          setPlanName(sub.plan || 'Free Trial');
          setActivePackages(sub.activePackages || []);
        }
      })
      .catch(() => {
        setPlanActive(false);
      });

    // Fetch certificates
    client.getCertificates()
      .then((certs: any) => {
        if (Array.isArray(certs)) {
          setCertificatesCount(certs.length);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    client.updateProfile({ phone, passportNumber, address, bio })
      .then((res) => {
        if (res.success) {
          setIsEditing(false);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      })
      .catch(() => {});
  };

  const isLearner = role.toLowerCase().includes('learner') || role.toLowerCase().includes('jemaah');

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-55 flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg shadow-lg text-xs font-bold transition-all">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce" />
          Profil berhasil diperbarui dan disimpan!
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex items-center justify-between">
        <div>
          <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-blue-100 text-blue-800 rounded-full">
            Informasi Akun
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">{d.profile}</h1>
          <p className="text-xs text-slate-400 mt-1">Detail data diri, status pendaftaran biro, dan progres belajar Anda.</p>
        </div>
      </div>

      {/* Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-center p-6">
            <div className="relative inline-block mt-4">
              <div className="w-20 h-20 rounded-full bg-blue-600/10 text-blue-700 text-2xl font-black flex items-center justify-center mx-auto uppercase">
                {userName.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white">✓</span>
            </div>
            
            <h3 className="font-extrabold text-base text-slate-900 mt-4">{userName}</h3>
            <span className="inline-block px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase mt-1">
              {isLearner ? 'Jemaah' : role}
            </span>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">{email}</p>

            <div className="mt-6 pt-5 border-t border-slate-100 text-left space-y-3.5 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Status Akun</span>
                  <span className="text-slate-800 font-semibold">Telah Terverifikasi</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Bergabung Sejak</span>
                  <span className="text-slate-800 font-semibold">{joinedDate || '8 Juli 2026'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Learning Stats for Learner */}
          {isLearner && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Progres Pelatihan</h4>
              
              <div className="space-y-3.5 text-xs font-semibold">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">Materi Terbuka</span>
                  </div>
                  <span className="text-[#1e40af] font-bold font-mono">
                    {activePackages.length} Paket Aktif
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">Sertifikat Kelulusan</span>
                  </div>
                  <span className="text-emerald-700 font-bold font-mono">
                    {certificatesCount} Sertifikat
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Editable Details & Credentials */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">Data Profil Pribadi</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-extrabold transition-all"
              >
                {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                <span>{isEditing ? 'Batal' : 'Edit Profil'}</span>
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)} 
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 cursor-not-allowed focus:outline-none"
                      disabled
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Email</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 cursor-not-allowed focus:outline-none"
                      disabled
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Nomor Telepon / WhatsApp</label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-650 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Nomor Paspor (Opsional)</label>
                    <input 
                      type="text" 
                      value={passportNumber} 
                      onChange={(e) => setPassportNumber(e.target.value)} 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-650 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Alamat Tinggal</label>
                  <input 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-650 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Bio Singkat</label>
                  <textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-650 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#1e40af] hover:bg-blue-800 text-white rounded-lg text-xs font-extrabold shadow-sm transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6 text-sm font-medium">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-4">
                  <div>
                    <span className="text-slate-400 text-[10px] font-extrabold uppercase block">Nama Lengkap</span>
                    <span className="text-slate-800 text-xs font-bold mt-1 block">{userName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] font-extrabold uppercase block">Alamat Email</span>
                    <span className="text-slate-800 text-xs font-bold mt-1 block">{email}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] font-extrabold uppercase block">Nomor Telepon</span>
                    <span className="text-slate-800 text-xs font-bold mt-1 block">{phone || '-'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] font-extrabold uppercase block">Nomor Paspor</span>
                    <span className="text-slate-800 text-xs font-bold mt-1 block">{passportNumber || '-'}</span>
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-slate-400 text-[10px] font-extrabold uppercase block">Alamat Tinggal</span>
                    <span className="text-slate-800 text-xs font-bold mt-1 block">{address || '-'}</span>
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-slate-400 text-[10px] font-extrabold uppercase block">Tentang Saya</span>
                    <span className="text-slate-800 text-xs font-bold mt-1.5 block italic leading-relaxed">{bio || '-'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Biro / Workspace Info Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide pb-4 border-b border-slate-100 mb-5">
              Workspace & Registrasi Biro
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-slate-400 text-[10px] font-extrabold uppercase block">Nama Biro Perjalanan</span>
                <span className="text-slate-800 text-xs font-bold mt-1 block">{tenantName}</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] font-extrabold uppercase block">Jenis Layanan Aktif</span>
                <span className="text-[#1e40af] text-xs font-bold mt-1 block capitalize">{planName}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
