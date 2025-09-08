import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPanel() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [messages, setMessages] = useState([]);
  const [editMsg, setEditMsg] = useState(null);

const fmtDate = (d) => {
  try {
    return new Date(d).toLocaleDateString("hr-HR", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch { return d; }
};

const rangeLabel = (start, end) => `${fmtDate(start)} — ${fmtDate(end)}`;

const daysBetween = (a, b) => {
  const s = new Date(a), e = new Date(b);
  const diff = Math.round((e - s) / 86400000) + 1;
  return Math.max(1, diff);
};


useEffect(() => {
    if (!user?.isAdmin) return;
    (async () => {
      const u = await axios.get("http://localhost:5001/api/admin/users");
      const p = await axios.get("http://localhost:5001/api/admin/plans");
      const m = await axios.get("http://localhost:5001/api/admin/messages");
      setUsers(u.data); setPlans(p.data); setMessages(m.data);
    })();
  }, [user]);

  async function deleteMessage(id) {
    await axios.delete(`http://localhost:5001/api/admin/messages/${id}`);
    setMessages(messages.filter(x => x.id !== id));
  }
  async function saveMessage() {
    await axios.put(`http://localhost:5001/api/admin/messages/${editMsg.id}`, editMsg);
    setMessages(messages.map(x => x.id === editMsg.id ? editMsg : x));
    setEditMsg(null);
  }

  if (!user?.isAdmin) return <div className="p-6">Nedostupno.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold">Admin Panel</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Korisnici</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {users.map(u => (
            <div key={u.id} className="border rounded p-3">
              <div>Email: {u.email}</div>
              <div>Admin: {u.isAdmin ? "Da" : "Ne"}</div>
              <div>Created: {new Date(u.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </section>

<section>
  <h2 className="text-xl font-semibold mb-2">AI Planovi</h2>
  <div className="space-y-2">
    {plans.map(p => (
      <div key={p.id} className="border rounded p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="font-semibold">{p.destination}</div>
            <div className="text-sm opacity-80">{p.userEmail}</div>
          </div>
          <div className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {rangeLabel(p.start_date, p.end_date)}
          </div>
        </div>

        <div className="mt-2 text-xs inline-block bg-black text-white rounded px-2 py-1">
          {daysBetween(p.start_date, p.end_date)} dana
        </div>

        <div className="mt-3 text-sm opacity-80">
          {(p.summary || "").slice(0,160)}...
        </div>
      </div>
    ))}
  </div>
</section>


      <section>
        <h2 className="text-xl font-semibold mb-2">Kontakt poruke</h2>
        <div className="space-y-3">
          
          {messages.map(m => (
            <div key={m.id} className="border rounded p-3 flex justify-between gap-4">
              <div>
                
                <div><b>{m.name}</b> — {m.email}</div>
                <div className="opacity-80">{m.message}</div>
                <div className="text-sm">{new Date(m.created_at).toLocaleString()}</div>
              </div>
              <div className="flex items-start gap-2">
                <button onClick={() => setEditMsg({...m})} className="px-3 py-1 rounded bg-yellow-500 text-white">Edit</button>
                <button onClick={() => deleteMessage(m.id)} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {editMsg && (
          <div className="mt-4 border rounded p-3">
            <h3 className="font-semibold mb-2">Uredi poruku</h3>
            <input className="border p-2 rounded w-full mb-2" value={editMsg.name} onChange={e=>setEditMsg({...editMsg, name:e.target.value})}/>
            <input className="border p-2 rounded w-full mb-2" value={editMsg.email} onChange={e=>setEditMsg({...editMsg, email:e.target.value})}/>
            <textarea className="border p-2 rounded w-full mb-2" rows={4} value={editMsg.message} onChange={e=>setEditMsg({...editMsg, message:e.target.value})}/>
            <div className="flex gap-2">
              <button onClick={saveMessage} className="px-4 py-2 bg-green-600 text-white rounded">Spremi</button>
              <button onClick={()=>setEditMsg(null)} className="px-4 py-2 bg-gray-500 text-white rounded">Odustani</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
