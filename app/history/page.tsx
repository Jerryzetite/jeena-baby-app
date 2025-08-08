'use client';
import RequireAuth from '@/components/RequireAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Event = { id: string; type: string; started_at: string; data: any };

export default function HistoryPage() {
  return (
    <RequireAuth>
      <HistoryInner />
    </RequireAuth>
  );
}

function HistoryInner() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from('events')
        .select('id,type,started_at,data')
        .order('started_at', { ascending: false })
        .limit(200);
      setEvents(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div>
      <h1>History</h1>
      {loading && <p>Loading…</p>}
      {!loading && events.length === 0 && <p>No entries yet.</p>}
      {events.map(e => (
        <div key={e.id} className="card">
          <b>{e.type}</b> — {new Date(e.started_at).toLocaleString()}
          <pre style={{margin:0, whiteSpace:'pre-wrap'}}>{JSON.stringify(e.data, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}
