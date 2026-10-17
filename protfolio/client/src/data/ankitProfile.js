// Canonical profile data for Ankit Kumar. The game UI, NPC dialog, AI server
// prompt, and bio panel all read from here so updates ripple everywhere.
// Kept in sync with the latest resume.

export const PROFILE = {
  name: 'Ankit Kumar',
  title: 'MERN Stack Developer',
  location: 'Chandigarh, India',
  status: 'Open to opportunities & collaborations',
  totalExperienceYears: 2,
};

// Categorized skills — used by the BioPanel UI.
export const SKILL_CATEGORIES = [
  {
    id: 'languages',
    icon: '📜',
    title: 'Languages',
    items: ['JavaScript (ES6+)', 'TypeScript'],
  },
  {
    id: 'frontend',
    icon: '⚛️',
    title: 'Frontend',
    items: ['React.js', 'Redux', 'HTML5', 'CSS3', 'Responsive UI/UX'],
  },
  {
    id: 'backend',
    icon: '🛠',
    title: 'Backend',
    items: ['Node.js', 'Express.js', 'REST APIs', 'JWT Authentication', 'WebSockets'],
  },
  {
    id: 'db',
    icon: '🗄',
    title: 'Database & Architecture',
    items: [
      'MongoDB',
      'Mongoose',
      'Aggregation Pipelines',
      'Query Optimization',
      'Multitenant Architecture',
      'RBAC',
    ],
  },
  {
    id: 'tools',
    icon: '⚙',
    title: 'Tools & DevOps',
    items: ['Git & GitHub', 'Docker', 'Postman', 'npm', 'Linux', 'Debugging', 'Performance Testing'],
  },
  {
    id: 'ai',
    icon: '🤖',
    title: 'AI',
    items: ['Generative AI', 'Prompt Engineering', 'LLM / AI API Integration', 'AI-assisted Development'],
  },
];

export const EXPERIENCE = [
  {
    id: 'allheartweb',
    org: 'AllHeartWeb',
    location: 'IT Park, Chandigarh',
    role: 'MERN Stack Developer',
    from: 'Dec 2025',
    to: 'Present',
    current: true,
    responsibilities: [
      'Developing and maintaining a scalable multitenant CRM & ERP platform with secure tenant-level data separation',
      'Building enterprise modules: Finance, Billing, Sales, Client Management, Live Chat, Helpdesk, Calendar, ETA, Drive & Team Tracking',
      'Optimizing backend logic and MongoDB aggregation pipelines — improved API response times by up to 35%',
      'Integrating automated email services, system logging, and analytics dashboards',
      'Building reusable React.js and Redux patterns, cutting code duplication and speeding up feature delivery',
      'Collaborating across frontend, backend, database, and API layers to ship production-ready business features',
    ],
  },
  {
    id: 'kbs',
    org: 'KBS-IT Solutions',
    location: 'Mohali',
    role: 'MERN Stack Developer',
    from: 'Jun 2024',
    to: 'Dec 2025',
    current: false,
    summary: '1.5 years building full-stack MERN features',
    responsibilities: [
      'Developed and integrated REST APIs with Node.js & Express.js, connected to React.js frontends',
      'Implemented end-to-end business workflows across frontend, backend, and database layers',
      'Investigated and resolved production issues, improving application stability',
      'Collaborated with cross-functional teams to develop, test, debug, and release features',
      'Managed database operations and API integration using MongoDB and Mongoose',
    ],
  },
];

export const EDUCATION = [
  {
    id: 'mca',
    degree: 'Master of Computer Applications (MCA)',
    institution: 'Chandigarh University',
    from: 2022,
    to: 2024,
    subjects: [
      'Mobile Applications',
      'DBMS',
      'Machine Learning',
      'IoT',
      'Web Applications',
      'Data Structures',
    ],
  },
  {
    id: 'bca',
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'Magadh University',
    from: 2018,
    to: 2022,
    subjects: ['Computer Architecture', 'Computational Theory', 'Learning Algorithms'],
  },
];

export const CONTACT = {
  email: 'ankitkumar26464@gmail.com',
  phone: '+91 9852263803',
  linkedin: 'linkedin.com/in/ankitkumar',
  github: 'github.com/ankitkumar',
  location: 'Chandigarh, India',
};

// ASCII-art blocks the AI/dialog can return verbatim when a user asks the
// matching command. These mirror the in-game console aesthetic.
export const BLOCKS = {
  greeting: `⚡ Welcome to ANKIT UNIVERSE

Hello and welcome. I am ANKIT-AI, your intelligent guide through the
professional journey, projects, skills and achievements of Ankit Kumar.

Explore:
🏫 Educational Journey   💻 MERN Stack Expertise
🚀 Professional Projects 🏢 Work Experience
🌌 Future Vision

Try: "tell me about Ankit" · "show MERN skills" · "experience" ·
"open Project City" · "activate recruiter mode" · "download resume"`,

  skills: `🧬 TECHNICAL SKILLS

📜 Languages
  ✔ JavaScript (ES6+)  ✔ TypeScript

⚛️ Frontend
  ✔ React.js  ✔ Redux  ✔ HTML5  ✔ CSS3  ✔ Responsive UI/UX

🛠 Backend
  ✔ Node.js  ✔ Express.js  ✔ REST APIs  ✔ JWT Authentication  ✔ WebSockets

🗄 Database & Architecture
  ✔ MongoDB  ✔ Mongoose  ✔ Aggregation Pipelines  ✔ Query Optimization
  ✔ Multitenant Architecture  ✔ RBAC

⚙ Tools & DevOps
  ✔ Git & GitHub  ✔ Docker  ✔ Postman  ✔ npm  ✔ Linux
  ✔ Debugging  ✔ Performance Testing

🤖 AI
  ✔ Generative AI  ✔ Prompt Engineering  ✔ LLM/AI API Integration
  ✔ AI-assisted Development`,

  experience: `🏢 PROFESSIONAL EXPERIENCE

▶ AllHeartWeb — IT Park, Chandigarh  (current)
   MERN Stack Developer · Dec 2025 → Present
   • Multitenant CRM & ERP platform with secure tenant-level data separation
   • Modules: Finance, Billing, Sales, Client Mgmt, Live Chat, Helpdesk,
     Calendar, ETA, Drive, Team Tracking
   • MongoDB aggregation pipelines — API response times up 35%
   • Automated email services, logging & analytics dashboards
   • Reusable React.js + Redux patterns

▶ KBS-IT Solutions — Mohali
   MERN Stack Developer · Jun 2024 → Dec 2025  (1.5 years)
   • REST APIs with Node.js & Express.js, wired to React.js frontends
   • End-to-end business workflows across the full stack
   • Investigated & resolved production issues
   • Database ops & API integration with MongoDB and Mongoose`,

  projects: `🚀 SHIPPED PROJECTS

▶ Enterprise Multitenant CRM Platform  (Company project)
   React.js + Redux + Node.js + Express.js + MongoDB + REST APIs
   RBAC and tenant-level data separation, Finance/Billing/Sales/Client
   Management/Live Chat/Helpdesk modules, MongoDB aggregation pipelines
   for reporting.

▶ Driveree — Full-stack food & parcel delivery platform  (2024 · Company project)
   MERN + Socket.io + Razorpay
   Live order tracking, 3 role-based dashboards (customer / restaurant /
   rider), cart + coupons + online payments, admin fleet panel.

▶ SearchTalent — Job recruitment & CV screening platform  (2024 · Company project)
   MERN + Gemini API + JWT
   Parses CVs into structured profiles, AI match-scores candidates
   against job descriptions, recruiter shortlist dashboard.

▶ Explorepedia — Social media platform  (2025 · Company project)
   MERN + JWT Authentication
   Post creation, sharing, likes and comments, secure JWT-based auth,
   REST APIs with MongoDB persistence.

▶ Sapience — College management system  (2025 · Company project)
   MERN
   Manage student and class information, track attendance, generate
   reports, and build timetables with conflict detection.

▶ Eta — Estimated time allocation & productivity tracker  (2026 · Company project)
   MERN
   Track time spent on tasks, generate reports, and visualize
   productivity trends across days, weeks, and months.

▶ Billing — Smart billing & invoicing system  (2026 · Company project)
   MERN
   Automated invoice generation, payment tracking with overdue
   reminders, and financial reporting with multi-currency support.

▶ Drive — Secure document management system  (2026 · Company project)
   MERN
   Store, organize, and share documents securely — version control,
   access permissions, and collaboration tools.

▶ Sheet — Cloud-based collaborative spreadsheet app  (2026 · Company project)
   MERN + Socket.io
   Store, organize, analyze, and visualize data — formulas, charts,
   and real-time multi-user editing from any browser or device.

Visit Project City in-game to walk through each one.`,

  education: `🎓 EDUCATIONAL BACKGROUND

🏛 MCA — Chandigarh University  (2022 – 2024)
   Mobile Apps · DBMS · Machine Learning · IoT · Web Apps · Data Structures

🏛 BCA — Magadh University  (2018 – 2022)
   Computer Architecture · Computational Theory · Learning Algorithms

✔ Academic journey successfully completed.`,

  contact: `📡 CONTACT INFORMATION

📧  ankitkumar26464@gmail.com
📱  +91 9852263803
🔗  linkedin.com/in/ankitkumar
💻  github.com/ankitkumar
📍  Chandigarh, India

🟢  Open to exciting opportunities and collaborations.
📄  Type "download resume" or hit the Resume button for the PDF.`,

  hire: `🎯 RECRUITER MODE — ACTIVATED

Name      Ankit Kumar
Role      MERN Stack Developer  (AllHeartWeb, IT Park Chandigarh)
Exp       2+ years professional, enterprise-grade MERN applications
Location  Chandigarh, India · Open to opportunities
Reach     ankitkumar26464@gmail.com · +91 9852263803

Strengths: React.js/Redux · Node/Express · MongoDB/Mongoose ·
Multitenant architecture & RBAC · Aggregation pipelines & perf tuning
(API response times -35%) · JWT & WebSockets · Docker · AI-assisted dev.

Shipped: Enterprise multitenant CRM/ERP (Finance, Billing, Sales,
Client Mgmt, Live Chat, Helpdesk, Calendar, ETA, Drive, Team Tracking) ·
Driveree (delivery) · SearchTalent (recruiting) · Explorepedia (social) ·
Sapience (college mgmt) · Eta/Billing/Drive/Sheet (business modules).

Type "projects" for the full case studies, or "download resume" for the PDF.`,
};

// Map user phrases → command keys. Used by the AI dialog overlay to short-
// circuit to a structured response without hitting Gemini.
export const COMMAND_PATTERNS = [
  { key: 'projects', re: /\b(projects?|driveree|searchtalent|explorepedia|sapience|Eta|Billing|Drive|Sheet|built|shipped|portfolio|crm|erp)\b/i },
  { key: 'skills', re: /\b(skills?|stack|technolog|mern)\b/i },
  { key: 'experience', re: /\b(experience|work|job|company|allheart|kbs)\b/i },
  { key: 'education', re: /\b(education|study|college|university|mca|bca|degree|school)\b/i },
  { key: 'contact', re: /\b(contact|email|phone|reach|hire me|find you|linkedin|github)\b/i },
  { key: 'hire', re: /\b(recruit|recruiter|hire|hiring|offer)\b/i },
  { key: 'greeting', re: /\b(hello|hi|hey|who are you|about ankit|tell me about)\b/i },
];

export function matchCommand(prompt) {
  const p = (prompt || '').trim();
  if (!p) return null;
  // Slash style
  const slash = p.match(/^\/(skills|projects|experience|education|contact|hire|greeting|help)/i);
  if (slash) return slash[1].toLowerCase() === 'help' ? 'greeting' : slash[1].toLowerCase();
  for (const c of COMMAND_PATTERNS) if (c.re.test(p)) return c.key;
  return null;
}
