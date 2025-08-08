'use client';
import RequireAuth from '@/components/RequireAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Event = { id: string; type: string; started_at: string; data: any };

export default function TodayPage() {
  return (
    <RequireAuth>
      <TodayInner />
    </RequireAuth>
  );
}

function TodayInner() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const load = async () => {
      const since = new Date();
      since.setHours(0,0,0,0);
      const { data } = await supabase.from('events')
        .select('id,type,started_at,data')
        .gte('started_at', since.toISOString())
        .order('started_at', { ascending: false });
      setEvents(data || []);
    };
    load();

    const channel = supabase
      .channel('events-stream')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => load())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div>
      <h1>Today</h1>
      <p>Quick view of today’s logs. Add more on the Add page.</p>
      {events.map(e => (
        <div key={e.id} className="card">
          <b>{e.type}</b> — {new Date(e.started_at).toLocaleTimeString()}
          <pre style={{margin:0, whiteSpace:'pre-wrap'}}>{JSON.stringify(e.data, null, 2)}</pre>
        </div>
      ))}
      {events.length === 0 && <p>No entries yet today.</p>}
    </div>
  );
}
