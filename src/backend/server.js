import 'dotenv/config';
import express from 'express';
import { createConnection } from 'mysql';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';

// ===== AI blok (jedina verzija) =====
const useMock = process.env.USE_MOCK_AI === '1';

// inicijaliziraj OpenAI klijent SAMO ako koristimo pravi API i postoji ključ
const openai = (!useMock && process.env.OPENAI_API_KEY)
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function daysBetween(d1, d2) {
  const a = new Date(d1), b = new Date(d2);
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
}

// MOCK generator – random aktivnosti po slotovima
function generateMockPlan({ destination, startDate, endDate, interests }) {
  const n = daysBetween(startDate, endDate);

  const morning = [
    "Jutarnja šetnja centrom",
    "Kava u lokalnom kafiću",
    "Posjet tržnici i doručak",
    "Rani odlazak do muzeja",
    "Jutarnja vožnja biciklom po okolici"
  ];
  const noon = [
    "Ručak u lokalnom bistrou",
    "Street food degustacija",
    "Ručak u restoranu s tradicionalnom kuhinjom",
    "Picknick u parku",
    "Brzi snack na tržnici"
  ];
  const afternoon = [
    "Posjet muzeju / galeriji",
    "Razgledavanje znamenitosti",
    "Šetnja uz rijeku ili more",
    "Obilazak stare gradske jezgre",
    "Vođeni obilazak autobusom ili brodom",
    "Shopping u centru"
  ];
  const evening = [
    "Večera i šetnja centrom",
    "Odlazak u lokalni bar s glazbom",
    "Večera na otvorenom s pogledom",
    "Kultura: kazalište ili koncert",
    "Noćni pogled s vidikovca"
  ];

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const days = Array.from({ length: n }, (_, i) => ({
    day: i + 1,
    title: `Dan ${i + 1} u ${destination}`,
    items: [
      { time: "09:00", activity: pick(morning) + (interests ? ` (${interests})` : "") },
      { time: "13:00", activity: pick(noon) },
      { time: "17:00", activity: pick(afternoon) },
      { time: "20:00", activity: pick(evening) },
    ]
  }));

  return {
    summary: `Plan putovanja za ${destination} od ${startDate} do ${endDate}. Fokus: ${interests || 'općenito'}.`,
    days
  };
}


async function generateRealPlan({ destination, startDate, endDate, interests }) {
  const prompt = `
Generiraj JSON itinerar na hrvatskom:
- destinacija: ${destination}
- od: ${startDate} do: ${endDate}
- interesi: ${interests || 'općenito'}
Vrati STROGO JSON:
{
  "summary": "kratak sažetak",
  "days": [
    { "day": 1, "title": "Naslov dana", "items": [
      {"time": "09:00", "activity": "opis"}, {"time":"popodne","activity":"opis"}
    ]}
  ]
}
`;
  const resp = await openai.responses.create({ model: 'gpt-4o-mini', input: prompt });
  const text = resp.output_text;
  try { return JSON.parse(text); } catch { throw new Error('AI_BAD_JSON'); }
}

async function generatePlanSafe(params) {
  if (useMock || !openai) return generateMockPlan(params);
  try {
    return await generateRealPlan(params);
  } catch (e) {
    if (e?.code === 'insufficient_quota' || e?.status === 429 || e?.message === 'AI_BAD_JSON') {
      return generateMockPlan(params);
    }
    throw e;
  }
}
// ===== kraj AI bloka =====

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// 1) DB konekcija
const db = createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'chatgpt_app'
});
db.connect((err) => {
  if (err) { console.error('Error connecting to MySQL:', err); process.exit(1); }
  console.log('MySQL connected...');
});

// 2) AUTH
app.post('/signup', (req, res) => {
  const { email, password } = req.body;
  const hashed = bcrypt.hashSync(password, 10);
  db.query('INSERT INTO users (email, password) VALUES (?,?)', [email, hashed], (err) => {
    if (err) return res.status(400).send('Signup error (možda email postoji?)');
    res.status(201).send('User registered successfully!');
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email=?', [email], (err, rows) => {
    if (err) return res.status(500).send('Internal Server Error');
    if (!rows.length) return res.status(404).send('User not found');
    const user = rows[0];
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).send('Invalid password');
    res.status(200).json({ user: { id: user.id, email: user.email, isAdmin: !!user.isAdmin } });
  });
});

// 3) ADMIN (users, plans, messages)
app.get('/api/admin/users', (req, res) => {
  db.query('SELECT id, email, isAdmin, created_at FROM users ORDER BY id DESC',
    (e, rows) => e ? res.status(500).send('Greška usera') : res.json(rows));
});
app.get('/api/admin/plans', (req, res) => {
  db.query(
    `SELECT p.*, u.email AS userEmail
     FROM plans p JOIN users u ON p.user_id = u.id
     ORDER BY p.created_at DESC`,
    (e, rows) => e ? res.status(500).send('Greška planova') : res.json(rows)
  );
});
app.get('/api/admin/messages', (req, res) => {
  db.query('SELECT * FROM contact_messages ORDER BY created_at DESC',
    (e, rows) => e ? res.status(500).send('Greška dohvaćanja') : res.json(rows));
});
app.put('/api/admin/messages/:id', (req, res) => {
  const { name, email, message } = req.body;
  db.query('UPDATE contact_messages SET name=?, email=?, message=? WHERE id=?',
    [name, email, message, req.params.id],
    (e) => e ? res.status(500).send('Greška UPDATE') : res.json({ ok: true }));
});
app.delete('/api/admin/messages/:id', (req, res) => {
  db.query('DELETE FROM contact_messages WHERE id=?', [req.params.id],
    (e) => e ? res.status(500).send('Greška DELETE') : res.json({ ok: true }));
});

// 4) Kontakt (ako ikad vratiš backend poziv)
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  db.query('INSERT INTO contact_messages (name, email, message) VALUES (?,?,?)',
    [name, email, message],
    (e) => e ? res.status(500).send('Greška slanja poruke') : res.status(201).json({ ok: true }));
});

// 5) AI plan – koristi safe (mock->real)
app.post('/api/ai/plan', (req, res) => {
  const { userId, destination, startDate, endDate, interests } = req.body;
  db.query('SELECT id FROM users WHERE id=?', [userId], async (err, rows) => {
    if (err) return res.status(500).send('Greška provjere korisnika');
    if (!rows.length) return res.status(401).send('Nelogiran korisnik');
    try {
      const data = await generatePlanSafe({ destination, startDate, endDate, interests });
      res.json({ ok: true, data, mock: useMock || !openai });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, error: 'AI greška' });
    }
  });
});

// 6) Spremanje/dohvat planova
app.post('/api/plans', (req, res) => {
  const { userId, destination, startDate, endDate, summary, days } = req.body;
  db.beginTransaction(err => {
    if (err) return res.status(500).send('Transakcija nije pokrenuta');
    db.query(
      'INSERT INTO plans (user_id, destination, start_date, end_date, summary) VALUES (?,?,?,?,?)',
      [userId, destination, startDate, endDate, summary],
      (e, r) => {
        if (e) { db.rollback(()=>{}); return res.status(500).send('Greška plan INSERT'); }
        const planId = r.insertId;

        const items = [];
        if (Array.isArray(days)) {
          for (const d of days) for (const it of (d.items || [])) {
            items.push([planId, d.day, it.time || null, (it.activity || '').slice(0,200), it.activity || null]);
          }
        }

        const commit = () => db.commit(err2 => {
          if (err2) { db.rollback(()=>{}); return res.status(500).send('Commit greška'); }
          res.json({ ok: true, planId });
        });

        if (!items.length) return commit();
        db.query(
          'INSERT INTO plan_items (plan_id, day_index, time_hint, title, details) VALUES ?',
          [items],
          (e2) => e2 ? (db.rollback(()=>{}), res.status(500).send('Greška items INSERT')) : commit()
        );
      }
    );
  });
});

app.get('/api/plans/:userId', (req, res) => {
  db.query('SELECT * FROM plans WHERE user_id=? ORDER BY created_at DESC', [req.params.userId],
    (e, rows) => e ? res.status(500).send('Greška planova') : res.json(rows));
});
app.get('/api/plan-items/:planId', (req, res) => {
  db.query('SELECT * FROM plan_items WHERE plan_id=? ORDER BY day_index, id', [req.params.planId],
    (e, rows) => e ? res.status(500).send('Greška stavki') : res.json(rows));
});

// CREATE stavke (dodaj novu aktivnost u plan)
app.post('/api/plan-items', (req, res) => {
  const { plan_id, day_index, time_hint, title, details } = req.body;
  db.query(
    'INSERT INTO plan_items (plan_id, day_index, time_hint, title, details) VALUES (?,?,?,?,?)',
    [plan_id, day_index, time_hint || null, title, details || null],
    (e, r) => e ? res.status(500).send('Greška INSERT plan_item') : res.status(201).json({ ok: true, id: r.insertId })
  );
});

// UPDATE stavke (uredi aktivnost)
app.put('/api/plan-items/:id', (req, res) => {
  const { day_index, time_hint, title, details } = req.body;
  db.query(
    'UPDATE plan_items SET day_index=?, time_hint=?, title=?, details=? WHERE id=?',
    [day_index, time_hint || null, title, details || null, req.params.id],
    (e) => e ? res.status(500).send('Greška UPDATE plan_item') : res.json({ ok: true })
  );
});

// DELETE stavke (obriši aktivnost)
app.delete('/api/plan-items/:id', (req, res) => {
  db.query('DELETE FROM plan_items WHERE id=?', [req.params.id],
    (e) => e ? res.status(500).send('Greška DELETE plan_item') : res.json({ ok: true }));
});

// UPDATE plana
app.put('/api/plans/:id', (req, res) => {
  const { destination, start_date, end_date, summary } = req.body;
  db.query(
    'UPDATE plans SET destination=?, start_date=?, end_date=?, summary=? WHERE id=?',
    [destination, start_date, end_date, summary, req.params.id],
    (e, r) => e ? res.status(500).send('Greška ažuriranja plana') : res.json({ ok: true })
  );
});

// DELETE plana
app.delete('/api/plans/:id', (req, res) => {
  db.query('DELETE FROM plans WHERE id=?', [req.params.id], (e, r) =>
    e ? res.status(500).send('Greška brisanja plana') : res.json({ ok: true })
  );
});

// CREATE stavke
app.post('/api/plan-items', (req, res) => {
  const { plan_id, day_index, time_hint, title, details } = req.body;
  db.query(
    'INSERT INTO plan_items (plan_id, day_index, time_hint, title, details) VALUES (?,?,?,?,?)',
    [plan_id, day_index, time_hint || null, title, details || null],
    (e, r) => e ? res.status(500).send('Greška INSERT plan_item') : res.status(201).json({ ok: true, id: r.insertId })
  );
});

// UPDATE stavke
app.put('/api/plan-items/:id', (req, res) => {
  const { title, details, time_hint } = req.body;
  db.query(
    'UPDATE plan_items SET title=?, details=?, time_hint=? WHERE id=?',
    [title, details, time_hint, req.params.id],
    (e, r) => e ? res.status(500).send('Greška ažuriranja stavke') : res.json({ ok: true })
  );
});

// DELETE stavke
app.delete('/api/plan-items/:id', (req, res) => {
  db.query('DELETE FROM plan_items WHERE id=?', [req.params.id],
    (e, r) => e ? res.status(500).send('Greška brisanja stavke') : res.json({ ok: true })
  );
});

// --- CHAT: simple travel asistent ---
app.post('/api/chat', async (req, res) => {
  const { userId, message, destination } = req.body || {};
  if (!userId) return res.status(401).json({ ok: false, error: 'Nelogiran korisnik' });
  if (!message || !message.trim()) return res.status(400).json({ ok: false, error: 'Prazna poruka' });

  // Ako želiš “travel fokus”, ubaci kratki system prompt:
  const system = `Ti si koristan AI asistent za planiranje putovanja. Odgovaraj kratko, praktično i na hrvatskom. 
Ako korisnik navede destinaciju, daj jasne prijedloge (mjesta, vrijeme posjete, cijene/karte, prijevoz).`;

  // MOCK odgovor ako USE_MOCK_AI=1 ili nema ključa/kvote
  const replyMock = () => {
    const hint = destination ? ` oko destinacije ${destination}` : '';
    return `Evo nekoliko brzih prijedloga${hint}:
• Jutro: kava u centru i kratka šetnja
• Podne: lokalni bistro (isprobaj dnevni menu)
• Poslijepodne: muzej/znamenitosti
• Večer: pogled s vidikovca + šetnja starim dijelom grada`;
  };

  try {
    if (!openai || useMock) {
      return res.json({ ok: true, mock: true, answer: replyMock() });
    }

    const prompt = destination
      ? `${system}\nKorisnik: ${message}\nDestinacija: ${destination}`
      : `${system}\nKorisnik: ${message}`;

    const ai = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
    });

    const text = ai.output_text?.trim() || replyMock();
    return res.json({ ok: true, mock: false, answer: text });
  } catch (e) {
    // fallback ako je kvota ili druga AI greška
    if (e?.code === 'insufficient_quota' || e?.status === 429) {
      return res.json({ ok: true, mock: true, answer: replyMock() });
    }
    console.error('[CHAT] error:', e);
    return res.status(500).json({ ok: false, error: 'AI greška' });
  }
});



// 7) Health
app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(port, () => console.log(`Server running on port ${port}`));
