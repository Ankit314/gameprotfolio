import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../store/gameStore';
import {
  PROFILE,
  SKILL_CATEGORIES,
  EXPERIENCE,
  EDUCATION,
  CONTACT,
} from '../data/ankitProfile';
import { PROJECTS } from '../data/gameData';
import ResumeButton from './ResumeButton.jsx';

const TABS = [
  { id: 'overview', label: 'Overview', icon: '◎' },
  { id: 'skills', label: 'Skills', icon: '🧬' },
  { id: 'projects', label: 'Projects', icon: '🚀' },
  { id: 'experience', label: 'Experience', icon: '🏢' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'contact', label: 'Contact', icon: '📡' },
];

export default function BioPanel() {
  const toggleUI = useGame((s) => s.toggleUI);
  const [tab, setTab] = useState('overview');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-30 flex items-center justify-center bg-black/65 backdrop-blur-sm"
        onClick={() => toggleUI('bio')}
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          className="glass rounded-2xl p-6 w-[min(820px,94vw)] max-h-[86vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <div className="text-[10px] tracking-[0.5em] font-display text-cyan-100/60 uppercase">
                Identity Card
              </div>
              <div className="font-display text-3xl neon-text">{PROFILE.name}</div>
              <div className="text-sm text-cyan-100/80">
                {PROFILE.title} · {PROFILE.location}
              </div>
            </div>
            <button className="text-xs font-mono text-cyan-100/60" onClick={() => toggleUI('bio')}>
              [P] close
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4 border-b border-cyan-100/10 pb-3">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-display uppercase tracking-widest border transition ${
                  tab === t.id
                    ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10'
                    : 'border-cyan-100/15 text-cyan-100/70 hover:border-neon-cyan/50'
                }`}
              >
                <span className="mr-1.5">{t.icon}</span>{t.label}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="overflow-y-auto pr-1 flex-1">
            {tab === 'overview' && <Overview />}
            {tab === 'skills' && <Skills />}
            {tab === 'projects' && <Projects />}
            {tab === 'experience' && <Experience />}
            {tab === 'education' && <EducationView />}
            {tab === 'contact' && <ContactView />}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Stat({ label, value, color = '#00f0ff' }) {
  return (
    <div className="rounded-lg border border-cyan-100/15 bg-white/5 p-3">
      <div className="text-[10px] tracking-[0.3em] uppercase font-display text-cyan-100/60">{label}</div>
      <div className="font-display text-lg" style={{ color }}>{value}</div>
    </div>
  );
}

function Overview() {
  const skillCount = SKILL_CATEGORIES.reduce((n, c) => n + c.items.length, 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Stat label="Experience" value={`${PROFILE.totalExperienceYears}+ yrs`} />
        <Stat label="Current Org" value="AllHeartWeb" color="#ffe600" />
        <Stat label="Skills" value={`${skillCount}+`} color="#ff2bd6" />
        <Stat label="Status" value="🟢 Open" color="#39ff14" />
      </div>
      <div className="rounded-lg border border-cyan-100/15 bg-white/5 p-4">
        <div className="text-[10px] tracking-[0.3em] uppercase font-display text-cyan-100/60 mb-1">
          Mission
        </div>
        <p className="text-sm text-cyan-100/85 leading-relaxed">
          MERN Stack Developer with 2+ years of experience building scalable,
          enterprise-grade web applications — currently developing a
          multitenant CRM/ERP platform at AllHeartWeb (IT Park, Chandigarh),
          after 1.5 years shipping full-stack features at KBS-IT Solutions.
          MCA from Chandigarh University, BCA from Magadh University. Based
          in Chandigarh, India — open to opportunities and collaborations.
        </p>
      </div>
    </div>
  );
}

function Skills() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {SKILL_CATEGORIES.map((c) => (
        <div key={c.id} className="rounded-lg border border-cyan-100/15 bg-white/5 p-3">
          <div className="font-display text-base neon-text mb-2">
            <span className="mr-2">{c.icon}</span>{c.title}
          </div>
          <ul className="text-sm text-cyan-100/85 grid grid-cols-2 gap-y-1 gap-x-3">
            {c.items.map((it) => (
              <li key={it} className="flex gap-1.5"><span className="text-neon-green">✔</span> {it}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Projects() {
  return (
    <div className="space-y-3">
      {PROJECTS.map((p) => (
        <div key={p.id} className="rounded-lg border border-cyan-100/15 bg-white/5 p-4">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <div className="font-display text-lg" style={{ color: p.color }}>{p.name}</div>
              <div className="text-sm text-cyan-100/80">{p.tagline}</div>
            </div>
            <div className="text-xs font-mono text-cyan-100/70 text-right">
              <div>{p.year} · {p.status}</div>
              <div>{p.role}</div>
            </div>
          </div>

          <p className="mt-2 text-sm text-cyan-100/85 leading-relaxed">{p.desc}</p>

          <ul className="mt-2 text-sm text-cyan-100/85 space-y-0.5">
            {p.features.map((f) => (
              <li key={f} className="flex gap-1.5"><span className="text-neon-green">•</span> {f}</li>
            ))}
          </ul>

          <div className="mt-2 rounded-md border border-cyan-100/10 bg-black/25 p-2.5 text-xs text-cyan-100/75">
            <span className="font-display uppercase tracking-widest text-[10px] text-cyan-100/55 mr-1.5">
              Challenge
            </span>
            {p.challenge}
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {p.stack.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-full bg-cyan-100/10 text-[11px] font-mono">{s}</span>
            ))}
            {p.links?.github && (
              <a
                href={p.links.github}
                target="_blank"
                rel="noreferrer"
                className="ml-auto px-2.5 py-0.5 rounded-full border border-neon-cyan/40 text-[11px] font-mono hover:bg-neon-cyan/10"
              >
                💻 Code
              </a>
            )}
            {p.links?.live && (
              <a
                href={p.links.live}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-0.5 rounded-full border border-neon-green/40 text-[11px] font-mono hover:bg-neon-green/10"
              >
                🔗 Live
              </a>
            )}
            {!p.links?.github && !p.links?.live && (
              <span
                className="ml-auto px-2.5 py-0.5 rounded-full border border-cyan-100/15 text-[11px] font-mono text-cyan-100/50"
                title="Built at AllHeartWeb/KBS-IT — the codebase is employer-owned and not publicly shareable"
              >
                🔒 Private — employer-owned codebase
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Experience() {
  return (
    <div className="space-y-3">
      {EXPERIENCE.map((e) => (
        <div
          key={e.id}
          className={`rounded-lg border p-4 ${e.current ? 'border-neon-cyan/60 bg-neon-cyan/5' : 'border-cyan-100/15 bg-white/5'}`}
        >
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <div className="font-display text-lg" style={{ color: e.current ? '#00f0ff' : '#a4d6ff' }}>
                {e.org}
              </div>
              <div className="text-xs text-cyan-100/65">📍 {e.location}</div>
            </div>
            <div className="text-xs font-mono text-cyan-100/70">
              {e.from} → {e.to}{e.current && ' · current'}
            </div>
          </div>
          <div className="text-sm font-display tracking-wide mt-1 text-cyan-100/80">{e.role}</div>
          {e.summary && <div className="text-xs text-cyan-100/70 mt-1 italic">{e.summary}</div>}
          <ul className="mt-2 text-sm text-cyan-100/85 space-y-0.5">
            {e.responsibilities.map((r) => (
              <li key={r} className="flex gap-1.5"><span className="text-neon-green">•</span> {r}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function EducationView() {
  return (
    <div className="space-y-3">
      {EDUCATION.map((e) => (
        <div key={e.id} className="rounded-lg border border-cyan-100/15 bg-white/5 p-4">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div className="font-display text-base neon-text-pink">{e.degree}</div>
            <div className="text-xs font-mono text-cyan-100/70">{e.from} – {e.to}</div>
          </div>
          <div className="text-sm text-cyan-100/80">{e.institution}</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {e.subjects.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-full bg-cyan-100/10 text-[11px] font-mono">{s}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactRow({ icon, label, value, href }) {
  const inner = (
    <div className="rounded-lg border border-cyan-100/15 bg-white/5 p-3 flex items-center gap-3 hover:border-neon-cyan/50 transition">
      <div className="text-xl">{icon}</div>
      <div>
        <div className="text-[10px] tracking-[0.3em] uppercase font-display text-cyan-100/60">{label}</div>
        <div className="font-mono text-sm text-cyan-100/90">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noreferrer" className="block">{inner}</a> : inner;
}

function ContactView() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ContactRow icon="📧" label="Email" value={CONTACT.email} href={`mailto:${CONTACT.email}`} />
        <ContactRow icon="📱" label="Phone" value={CONTACT.phone} href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`} />
        <ContactRow icon="🔗" label="LinkedIn" value={CONTACT.linkedin} href={`https://${CONTACT.linkedin}`} />
        <ContactRow icon="💻" label="GitHub" value={CONTACT.github} href={`https://${CONTACT.github}`} />
        <ContactRow icon="📍" label="Location" value={CONTACT.location} />
        <ContactRow icon="🟢" label="Status" value="Open to opportunities" />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <a
          href={`mailto:${CONTACT.email}?subject=Opportunity%20for%20Ankit%20Kumar`}
          className="btn btn-primary flex-1 text-center"
        >
          🎯 Send Hiring Email
        </a>
        <ResumeButton className="flex-1 justify-center" />
      </div>
    </div>
  );
}
