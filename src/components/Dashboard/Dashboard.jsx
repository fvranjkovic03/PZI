import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [plans, setPlans] = useState([]);
  const [items, setItems] = useState([]);
  const [activePlan, setActivePlan] = useState(null);

  // Fetch planovi
  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5001/api/plans/${user.id}`)
      .then(r => r.json())
      .then(setPlans)
      .catch(e => console.error("Greška planovi:", e));
  }, [user]);

  // Otvori plan
  async function openPlan(p) {
    setActivePlan(p);
    const r = await fetch(`http://localhost:5001/api/plan-items/${p.id}`);
    setItems(await r.json());
  }

  // --- CRUD funkcije ---
  async function deletePlan(id) {
    if (!window.confirm("Obrisati plan?")) return;
    await fetch(`http://localhost:5001/api/plans/${id}`, { method: "DELETE" });
    setPlans(plans.filter(p => p.id !== id));
    if (activePlan?.id === id) { setActivePlan(null); setItems([]); }
  }

  async function editPlan(p) {
    const newSummary = prompt("Novi sažetak:", p.summary);
    if (!newSummary) return;
    await fetch(`http://localhost:5001/api/plans/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, summary: newSummary })
    });
    setPlans(plans.map(x => x.id === p.id ? { ...x, summary: newSummary } : x));
    if (activePlan?.id === p.id) setActivePlan({ ...activePlan, summary: newSummary });
  }

  async function deleteItem(id) {
    if (!window.confirm("Obrisati stavku?")) return;
    await fetch(`http://localhost:5001/api/plan-items/${id}`, { method: "DELETE" });
    setItems(items.filter(i => i.id !== id));
  }

  async function editItem(it) {
    const newTitle = prompt("Novi naslov:", it.title);
    if (!newTitle) return;
    await fetch(`http://localhost:5001/api/plan-items/${it.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...it, title: newTitle })
    });
    setItems(items.map(x => x.id === it.id ? { ...x, title: newTitle } : x));
  }

  if (!user) return <div className="p-6">Prijavi se.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Tvoji planovi</h1>

      <div className="grid md:grid-cols-2 gap-4">
        {plans.map(p => (
          <div key={p.id} className="border rounded p-3 bg-white dark:bg-gray-800">
            <div className="font-semibold">{p.destination}</div>
            <div className="text-sm opacity-80">{p.start_date} → {p.end_date}</div>
            <div className="text-sm mt-2">{(p.summary || "").slice(0,140)}...</div>

            <div className="flex gap-2 mt-3">
              <button onClick={()=>openPlan(p)} className="px-3 py-1 rounded bg-black text-white">Otvori</button>
              <button onClick={()=>editPlan(p)} className="px-3 py-1 rounded bg-yellow-500 text-white">Uredi</button>
              <button onClick={()=>deletePlan(p.id)} className="px-3 py-1 rounded bg-red-600 text-white">Obriši</button>
            </div>
          </div>
        ))}
      </div>

      {activePlan && (
        <div className="border rounded p-4 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-2">
            {activePlan.destination} — {activePlan.start_date} → {activePlan.end_date}
          </h2>
          <p className="mb-4">{activePlan.summary}</p>

          <h3 className="font-semibold">Stavke</h3>
          {items.map(it => (
            <div key={it.id} className="border rounded p-3 mb-2">
              <div className="font-medium">Dan {it.day_index}: {it.title}</div>
              <div className="text-sm opacity-80">{it.time_hint || "—"}</div>
              <div>{it.details}</div>
              <div className="flex gap-2 mt-2">
                <button onClick={()=>editItem(it)} className="px-2 py-1 bg-yellow-500 text-white rounded">Uredi</button>
                <button onClick={()=>deleteItem(it.id)} className="px-2 py-1 bg-red-600 text-white rounded">Obriši</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div>Nema stavki.</div>}
        </div>
      )}
    </div>
  );
}
