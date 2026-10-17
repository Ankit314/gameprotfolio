import { BLOCKS, matchCommand } from '../data/ankitProfile';

// Returns the structured block for known commands without hitting the server.
function localCommand(prompt) {
  const cmd = matchCommand(prompt);
  if (!cmd) return null;
  return BLOCKS[cmd] || null;
}

function fallback(prompt) {
  const block = localCommand(prompt);
  if (block) return block;
  const p = (prompt || '').toLowerCase();
  if (!p) return BLOCKS.greeting;
  if (/who|about|ankit/.test(p))
    return 'Ankit Kumar — MERN Stack Developer based in Chandigarh. 2+ years of experience, now building a multitenant CRM/ERP platform at AllHeartWeb.';
  if (/resume|cv|download/.test(p))
    return 'Hit the "Download Resume" button in the menu or HUD for the PDF.';
  return 'I can talk about Ankit\'s skills, experience at AllHeartWeb & KBS-IT, his MCA/BCA education, or how to reach him — or just download his resume.';
}

export async function askAnkitAI(prompt) {
  // Short-circuit known commands for instant, perfectly-formatted replies.
  const block = localCommand(prompt);
  if (block) return block;

  try {
    const r = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    return data.reply || fallback(prompt);
  } catch (e) {
    return fallback(prompt);
  }
}
