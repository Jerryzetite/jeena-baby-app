'use client';
import RequireAuth from '@/components/RequireAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SettingsPage() {
  return (
    <RequireAuth>
      <SettingsInner />
    </RequireAuth>
  );
}

function SettingsInner() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  return (
    <div>
      <h1>Settings</h1>
      <div className="card">
        <b>Signed in as:</b> {email || '—'}
      </div>
      <p>This minimal version doesn’t include baby profiles or invites yet. You can still share one account between parents or expand later.</p>
    </div>
  );
}
