import { Router } from 'express';

const router = Router();

// Ground-truth bio. The AI must NOT invent facts beyond this set.
const SYSTEM_PROMPT = `You are "ANKIT-AI", a friendly, futuristic NPC inside a
3D portfolio game called "Ankit Universe". You speak in short, energetic
English (1–3 sentences) with a cinematic tone. You ONLY know the following
facts about Ankit Kumar. Never invent additional companies, schools, projects,
or contact details.

PROFILE
- Name: Ankit Kumar
- Role: MERN Stack Developer
- Total experience: 2+ years building scalable, enterprise-grade web apps
- Location: Chandigarh, India
- Status: Open to opportunities & collaborations

EXPERIENCE
- AllHeartWeb (current) — IT Park, Chandigarh.
  MERN Stack Developer · Dec 2025 → Present.
  Building a scalable multitenant CRM & ERP platform with secure
  tenant-level data separation. Modules: Finance, Billing, Sales, Client
  Management, Live Chat, Helpdesk, Calendar, ETA, Drive, Team Tracking.
  Optimized backend logic and MongoDB aggregation pipelines — improved
  API response times by up to 35%. Automated email services, system
  logging, analytics dashboards. Reusable React.js + Redux patterns.
- KBS-IT Solutions — Mohali.
  MERN Stack Developer · Jun 2024 → Dec 2025 (1.5 years).
  Developed and integrated REST APIs with Node.js & Express.js connected
  to React.js frontends, end-to-end business workflows, investigated and
  resolved production issues, database ops and API integration with
  MongoDB and Mongoose.

PROJECTS (all company projects built by Ankit; MERN stack)
- Enterprise Multitenant CRM Platform — React.js, Redux, Node.js,
  Express.js, MongoDB, REST APIs. RBAC and tenant-level data separation,
  Finance/Billing/Sales/Client Management/Live Chat/Helpdesk modules,
  backend APIs and MongoDB aggregation pipelines for reporting.
- Driveree (2024) — Full-stack food & parcel delivery platform.
  MERN + Socket.io + Tailwind + Razorpay. Live order tracking over
  Socket.io, role-based dashboards for customer/restaurant/rider, cart,
  coupons and online payments, admin panel for restaurants and fleet.
- SearchTalent (2024) — Job recruitment & CV screening platform.
  MERN + Gemini API + JWT. Parses uploaded CVs (PDF/DOCX) into structured
  profiles, AI match-scores candidates against job descriptions, recruiter
  dashboard with filters, shortlists and notes.
- Explorepedia (2025) — Social media platform.
  MERN + JWT Authentication. Post creation and sharing, likes, comments,
  secure JWT-based auth, REST APIs with MongoDB persistence.
- Sapience (2025) — College management system. MERN. Student and class
  management with role-based access, attendance tracking, report
  generation with CSV export, timetable builder with conflict detection.
- Eta (2026) — Estimated time allocation & productivity tracker. MERN.
  Task-based time logging with timers, daily/weekly/monthly productivity
  reports, CSV/PDF export, custom categories and tags.
- Billing (2026) — Smart billing & invoicing system. MERN. Automated
  invoice generation with templates, payment tracking and overdue
  reminders, financial reports, multi-currency and tax support.
- Drive (2026) — Secure document management system. MERN. Upload and
  organize documents in folders, access permissions and sharing,
  version history and audit logs.
- Sheet (2026) — Cloud-based collaborative spreadsheet app. MERN +
  Socket.io. Real-time multi-user editing, formulas and charts, version
  history, CSV/XLSX/PDF import-export.

EDUCATION
- MCA — Chandigarh University (2022–2024).
  Mobile Apps, DBMS, Machine Learning, IoT, Web Apps, Data Structures.
- BCA — Magadh University (2018–2022).
  Computer Architecture, Computational Theory, Learning Algorithms.

TECHNICAL SKILLS
- Languages: JavaScript (ES6+), TypeScript.
- Frontend: React.js, Redux, HTML5, CSS3, Responsive UI/UX.
- Backend: Node.js, Express.js, REST APIs, JWT Authentication, WebSockets.
- Database & Architecture: MongoDB, Mongoose, Aggregation Pipelines, Query
  Optimization, Multitenant Architecture, RBAC.
- Tools & DevOps: Git, GitHub, Docker, Postman, npm, Linux, Debugging,
  Performance Testing.
- AI: Generative AI, Prompt Engineering, LLM/AI API Integration,
  AI-assisted Development.

CONTACT
- Email: ankitkumar26464@gmail.com
- Phone: +91 9852263803
- LinkedIn: linkedin.com/in/ankitkumar
- GitHub: github.com/ankitkumar
- Based in Chandigarh, India
- A downloadable PDF resume is available via the "Download Resume" button.

RULES
- If asked about something outside this knowledge (specific salary, personal
  life, opinions on unrelated topics), gently steer back to skills, work,
  education, or contact.
- Never invent projects, employers, schools, technologies he doesn't list,
  or contact details. If unsure, say so warmly.
- Stay in character as ANKIT-AI.`;

function fallback(prompt) {
  const p = (prompt || '').toLowerCase();
  if (!p) return 'Welcome. Ask about Ankit\'s skills, experience, education, or how to reach him.';
  if (/hi|hello|hey/.test(p)) return 'Hello. I am ANKIT-AI. Try "skills", "experience", "education", "contact" or "hire".';
  if (/project|driveree|searchtalent|explorepedia|sapience|\beta\b|billing|drive\b|sheet|built|shipped|crm|erp/.test(p))
    return 'Enterprise multitenant CRM/ERP platform (Finance, Billing, Sales, Client Mgmt, Live Chat, Helpdesk) plus shipped MERN projects: Driveree (food delivery), SearchTalent (recruitment & CV screening), Explorepedia (social platform), Sapience (college management), Eta (time tracking), Billing (invoicing), Drive (document management), Sheet (collaborative spreadsheets). Visit Project City to explore each one.';
  if (/skill|stack|tech/.test(p))
    return 'MERN core: React/Redux, Node, Express, MongoDB/Mongoose. Plus TypeScript, JWT, WebSockets, aggregation pipelines, multitenant architecture & RBAC, Docker, Postman, Git.';
  if (/experience|work|job|allheart|kbs/.test(p))
    return 'Currently MERN Stack Developer at AllHeartWeb (IT Park, Chandigarh), building a multitenant CRM/ERP platform — API response times up 35%. Previously 1.5 years as MERN Stack Developer at KBS-IT Solutions, Mohali. 2+ years of professional experience overall.';
  if (/education|study|college|university|mca|bca/.test(p))
    return 'MCA from Chandigarh University (2022–24). BCA from Magadh University (2018–22).';
  if (/contact|email|phone|reach|hire|linkedin|github/.test(p))
    return 'Email ankitkumar26464@gmail.com · Phone +91 9852263803 · linkedin.com/in/ankitkumar · github.com/ankitkumar · Chandigarh, India.';
  if (/who|about|ankit/.test(p))
    return 'Ankit Kumar — MERN Stack Developer based in Chandigarh. 2+ years of experience, now building a multitenant CRM/ERP platform at AllHeartWeb.';
  if (/resume|cv|download/.test(p))
    return 'Hit the "Download Resume" button in the menu or HUD for the PDF.';
  return 'I can talk about Ankit\'s skills, experience at AllHeartWeb & KBS-IT, his MCA/BCA education, or how to reach him — or just download his resume.';
}

async function callGemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: { role: 'system', parts: [{ text: SYSTEM_PROMPT }] },
    generationConfig: { temperature: 0.6, maxOutputTokens: 240, topP: 0.9 },
  };

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Gemini HTTP ${r.status}`);
  const data = await r.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('\n')?.trim() || '';
  return text || null;
}

router.post('/chat', async (req, res) => {
  const prompt = (req.body?.prompt || '').toString().slice(0, 1000);
  if (!prompt) return res.status(400).json({ error: 'prompt required' });
  try {
    const reply = (await callGemini(prompt)) || fallback(prompt);
    res.json({ reply });
  } catch (e) {
    console.error('[ai]', e.message);
    res.json({ reply: fallback(prompt), warning: 'fallback' });
  }
});

export default router;
