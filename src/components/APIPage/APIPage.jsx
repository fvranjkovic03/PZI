import React, { useState } from "react";

export default function APIPage() {
  const user = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();

  const [destination, setDestination] = useState("");
  const [startDate, setStart] = useState("");
  const [endDate, setEnd] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);

  const [aiData, setAiData] = useState(null);   // { summary, days: [...] }
  const [mockFlag, setMockFlag] = useState(false);

  // --- CHAT state ---
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Bok! Postavi bilo koje pitanje o putovanju ili destinaciji." }
  ]);

  const fmt = (d) => { try { return new Date(d).toLocaleDateString(); } catch { return d; } };

  async function generatePlan(e) {
    e.preventDefault();
    if (!user) { alert("Prijavi se da koristiš AI."); return; }
    if (!destination || !startDate || !endDate) { alert("Popuni destinaciju i datume."); return; }

    setLoading(true);
    setAiData(null);
    try {
      const r = await fetch("http://localhost:5001/api/ai/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          destination, startDate, endDate, interests
        })
      });
      if (!r.ok) {
        const t = await r.text().catch(()=>"(no text)");
        throw new Error(`AI HTTP ${r.status}: ${t}`);
      }
      const data = await r.json();
      if (!data?.ok || !data?.data) throw new Error("AI odgovor neočekivan.");
      setAiData(data.data);         // { summary, days: [...] }
      setMockFlag(!!data.mock);
    } catch (err) {
      console.error("[API] generatePlan error:", err);
      alert("Greška generiranja plana (pogledaj Console).");
    } finally {
      setLoading(false);
    }
  }

  async function saveToDB() {
    if (!user) { alert("Prijavi se."); return; }
    if (!aiData) { alert("Nema generiranog plana za spremiti."); return; }

    try {
      const r = await fetch("http://localhost:5001/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          destination,
          startDate,
          endDate,
          summary: aiData.summary || "",
          days: aiData.days || []
        })
      });
      if (!r.ok) {
        const t = await r.text().catch(()=>"(no text)");
        throw new Error(`SAVE HTTP ${r.status}: ${t}`);
      }
      const out = await r.json();
      alert(`Spremljeno! Plan ID: ${out.planId}`);
    } catch (e) {
      console.error("[API] saveToDB error:", e);
      alert("Greška spremanja plana.");
    }
  }

  // --- CHAT: pošalji poruku ---
  async function sendChat(e) {
    e.preventDefault();
    if (!user) { alert("Prijavi se za chat."); return; }
    const text = chatInput.trim();
    if (!text) return;

    // prikaži odmah user poruku
    setMessages(prev => [...prev, { role: "user", text }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const r = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          message: text,
          destination: destination || aiData?.destination || ""
        })
      });
      const data = await r.json();
      if (!r.ok || !data?.ok) throw new Error(data?.error || `HTTP ${r.status}`);
      setMessages(prev => [...prev, { role: "assistant", text: data.answer }]);
      if (data.mock) {
        // ako želiš, možeš prikazati banner da je mock
        console.log("[CHAT] mock odgovor");
      }
    } catch (err) {
      console.error("[CHAT] error:", err);
      setMessages(prev => [...prev, { role: "assistant", text: "Došlo je do greške s AI-jem. Pokušaj ponovno." }]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AI Planer putovanja</h1>

      {!user && (
        <div className="mb-4 rounded bg-yellow-100 text-yellow-900 px-3 py-2 text-sm">
          Gost može pregledavati stranicu, ali generiranje plana i chat su za prijavljene korisnike.
        </div>
      )}

      {/* FORMA ZA PLAN */}
      <form onSubmit={generatePlan} className="space-y-3 mb-6">
        <input
          className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          placeholder="Destinacija (npr. Rim)"
          value={destination}
          onChange={(e)=>setDestination(e.target.value)}
          required
        />
        <div className="flex gap-3">
          <input type="date"
            className="flex-1 border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
            value={startDate}
            onChange={(e)=>setStart(e.target.value)}
            required
          />
          <input type="date"
            className="flex-1 border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
            value={endDate}
            onChange={(e)=>setEnd(e.target.value)}
            required
          />
        </div>
        <input
          className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          placeholder="Interesi (npr. muzeji, hrana, priroda...) — opcionalno"
          value={interests}
          onChange={(e)=>setInterests(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Generiram..." : "Generiraj plan"}
        </button>
      </form>

      {/* PRIKAZ PLAN-a */}
      {aiData && (
        <div className="space-y-4 mb-10">
          {mockFlag && (
            <div className="rounded bg-blue-100 text-blue-900 px-3 py-2 text-sm">
              Trenutno je aktivan mock (USE_MOCK_AI=1 ili nema kvote) – plan je generiran bez pravog API poziva.
            </div>
          )}

          <div className="border rounded p-4 bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-2">
              {destination} — {fmt(startDate)} → {fmt(endDate)}
            </h2>
            <p className="mb-4">{aiData.summary}</p>

            <div className="space-y-3">
              {Array.isArray(aiData.days) && aiData.days.map((d, idx) => (
                <div key={idx} className="border rounded p-3">
                  <div className="font-medium">Dan {d.day}: {d.title}</div>
                  <ul className="list-disc pl-5">
                    {(d.items || []).map((it, i) => (
                      <li key={i}>
                        <span className="opacity-70 mr-2">{it.time || "—"}</span>
                        {it.activity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {(!aiData.days || aiData.days.length === 0) && <div>Nema stavki.</div>}
            </div>

            <button onClick={saveToDB} className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Spremi u bazu
            </button>
          </div>
        </div>
      )}

      {/* CHAT ispod – uvijek vidljiv kad je user prijavljen */}
      <div className="border rounded p-4 bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-3">Chat preporuke</h2>
        <div className="space-y-2 max-h-80 overflow-y-auto mb-3">
          {messages.map((m, idx) => (
            <div key={idx} className={m.role === "assistant" ? "text-left" : "text-right"}>
              <div className={`inline-block px-3 py-2 rounded ${m.role === "assistant" ? "bg-gray-100 dark:bg-gray-700" : "bg-black text-white"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendChat} className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
            placeholder={destination ? `Pitaj nešto o ${destination}…` : "Napiši pitanje o putovanju…"}
            value={chatInput}
            onChange={e=>setChatInput(e.target.value)}
            disabled={!user}
          />
          <button
            className="bg-black text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-60"
            disabled={!user || chatLoading}
          >
            {chatLoading ? "Šaljem…" : "Pošalji"}
          </button>
        </form>
        {!user && <div className="text-sm text-gray-500 mt-2">Prijava je potrebna za chat.</div>}
      </div>
    </div>
  );
}
