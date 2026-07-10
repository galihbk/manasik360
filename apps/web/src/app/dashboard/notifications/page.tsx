'use client';

import React, { useState, useEffect } from 'react';
import { en, id, ar } from '@bahrain/localization';
import { ApiClient } from '@bahrain/api-client';

const client = new ApiClient({ baseUrl: '/api/v1' });

export default function NotificationsPage() {
  const [lang, setLang] = useState('en');
  const [notifications, setNotifications] = useState<any[]>([]);

  // Translation helpers
  const tMap: Record<string, any> = { en, id, ar };
  const t = tMap[lang] || en;
  const d = t.dashboard || en.dashboard;

  useEffect(() => {
    const savedLang = localStorage.getItem('bahrain_lang') || 'en';
    setLang(savedLang);

    // Fetch dynamic notifications from NestJS API
    client.getNotifications()
      .then((data) => {
        if (data && Array.isArray(data)) {
          setNotifications(data);
        }
      })
      .catch(() => {
        setNotifications([
          { id: 'n-1', title: 'Welcome to Bahrain International V2', message: 'Study sequence modules and interact with virtual 360 tours.', createdAt: new Date().toISOString() }
        ]);
      });
  }, []);

  return (
    <div className="p-8 w-full space-y-6 py-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{d.notifications}</h2>
        <p className="text-sm text-slate-400 mt-0.5 font-medium">Important curriculum updates</p>
      </div>

      <div className="border border-slate-200 rounded-lg bg-white divide-y divide-slate-100 shadow-sm">
        {notifications.map((notif, idx) => (
          <div key={notif.id || idx} className="p-5 flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-slate-900">{notif.title}</h4>
              <p className="text-sm text-slate-400 mt-1 font-medium">{notif.message}</p>
            </div>
            <span className="text-xs text-slate-400 shrink-0 font-medium">
              {new Date(notif.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
