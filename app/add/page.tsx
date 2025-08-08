'use client';
import RequireAuth from '@/components/RequireAuth';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AddPage() {
  return (
    <RequireAuth>
      <AddInner />
    </RequireAuth>
  );
}

function AddInner() {
  const [type, setType] = useState('diaper');
  const [amountMl, setAmountMl] = useState<number | ''>('');
  const [diaperKind, setDiaperKind] = useState('wet');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const data: any = { notes };
    if (type === 'feed' && amountMl) data.amount_ml = Number(amountMl);
    if (type === 'diaper') data.diaper = diaperKind;

    const payload = { type, started_at: new Date().toISOString(), data };
    const { error } = await supabase.from('events').insert(payload);
    setSaving(false);
    if (error) setMsg(error.message);
    else { setMsg('Saved!'); setAmountMl(''); setNotes(''); }
  };

  return (
    <div>
      <h1>Add Entry</h1>
      <form onSubmit={submit}>
        <label>Type</label>
        <select value={type} onChange={e=>setType(e.target.value)}>
          <option value="feed">Feed</option>
          <option value="diaper">Diaper</option>
          <option value="sleep">Sleep</option>
          <option value="pump">Pump</option>
          <option value="med">Medicine</option>
          <option value="measure">Measurement</option>
        </select>

        {type === 'feed' && (<>
          <label>Amount (ml)</label>
          <input type="number" value={amountMl} onChange={e=>setAmountMl(e.target.value ? Number(e.target.value) : '')} />
        </>)}

        {type === 'diaper' && (<>
          <label>Diaper</label>
          <select value={diaperKind} onChange={e=>setDiaperKind(e.target.value)}>
            <option value="wet">Wet</option>
            <option value="soiled">Soiled</option>
            <option value="both">Both</option>
          </select>
        </>)}

        <label>Notes</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} />
        <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        {msg && <p>{msg}</p>}
      </form>
    </div>
  );
}
