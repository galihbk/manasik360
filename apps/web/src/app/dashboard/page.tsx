'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { ApiClient } from '@bahrain/api-client';
import { en, id, ar } from '@bahrain/localization';
import OrgDashboard from './components/OrgDashboard';
import LearnerDashboard from './components/LearnerDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function HomePage() {
  const [userName, setUserName] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [lang, setLang] = useState('en');
  const [role, setRole] = useState('Learner');
  const [orgData, setOrgData] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [subscription, setSubscription] = useState<any>(null);
  const [certificatesCount, setCertificatesCount] = useState(0);

  // Translation helpers
  const tMap: Record<string, any> = { en, id, ar };
  const t = tMap[lang] || en;
  const d = t.dashboard || en.dashboard;

  useEffect(() => {
    const storedName = localStorage.getItem('bahrain_user_name');
    const storedRole = localStorage.getItem('bahrain_user_role') || 'Learner';
    const savedLang = localStorage.getItem('bahrain_lang') || 'en';
    if (storedName) setUserName(storedName);
    setRole(storedRole);
    setLang(savedLang);

    client.getProfile()
      .then((data) => {
        if (data) {
          if (data.name) {
            setUserName(data.name);
          }
          if (data.role) {
            const normalizedRole = data.role === 'ORG_ADMIN' || data.role === 'ORG ADMIN' 
              ? 'Org Admin' 
              : data.role === 'SUPER_ADMIN' || data.role === 'SUPER ADMIN'
                ? 'Super Admin'
                : data.role;
            if (normalizedRole !== role) {
              setRole(normalizedRole);
              localStorage.setItem('bahrain_user_role', normalizedRole);
            }
          }
        }
      })
      .catch(() => {});

    // Fetch subscription status
    client.getSubscription()
      .then((sub: any) => {
        if (sub) {
          setSubscription(sub);
        }
      })
      .catch(() => {});

    // Fetch certificates count
    client.getCertificates()
      .then((certs: any) => {
        if (Array.isArray(certs)) {
          setCertificatesCount(certs.length);
        }
      })
      .catch(() => {});

    // Fetch with retry — handles NestJS startup delay
    const fetchWithRetry = async (retries = 3, delayMs = 2000): Promise<void> => {
      try {
        const data = await client.getPaths();
        if (data && data.courses) {
          setCourses(data.courses);
        }
      } catch {
        if (retries > 0) {
          await new Promise(r => setTimeout(r, delayMs));
          return fetchWithRetry(retries - 1, delayMs);
        }
      }
    };

    fetchWithRetry();

    // Fetch Org dashboard details if administrator
    if (storedRole === 'Org Admin') {
      client.getOrgDashboard()
        .then((data) => {
          if (data && !data.error) {
            setOrgData(data);
          }
        })
        .catch((e) => console.error("Error fetching org dashboard:", e));
    }
  }, [role]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (role === 'Super Admin') {
    return (
      <Suspense fallback={null}>
        <SuperAdminDashboard />
      </Suspense>
    );
  }

  if (role === 'Org Admin') {
    return (
      <OrgDashboard
        orgData={orgData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        copiedCode={copiedCode}
        copyToClipboard={copyToClipboard}
      />
    );
  }

  return (
    <LearnerDashboard
      userName={userName}
      courses={courses}
      d={d}
      lang={lang}
      subscription={subscription}
      certificatesCount={certificatesCount}
    />
  );
}
