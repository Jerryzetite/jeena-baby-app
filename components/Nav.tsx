'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Nav() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <nav style={{display:'flex',gap:12, padding:12, borderBottom:'1px solid #eee'}}>
      <Link href="/">Today</Link>
      <Link href="/add">Add</Link>
      <Link href="/history">History</Link>
      <Link href="/settings">Settings</Link>
      <div style={{marginLeft:'auto'}}>
        {email ? (
          <button onClick={() => supabase.auth.signOut()}>Sign out</button>
        ) : (
          <Link href="/login">Sign in</Link>
        )}
      </div>
    </nav>
  );
}
