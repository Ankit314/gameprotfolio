import React from 'react';
import { motion } from 'framer-motion';
import {
  PROFILE,
  SKILL_CATEGORIES,
  EXPERIENCE,
  EDUCATION,
  CONTACT,
} from '../data/ankitProfile';
import { PROJECTS } from '../data/gameData';
import ResumeButton from '../ui/ResumeButton.jsx';
import {
  MailIcon,
  PhoneIcon,
  LinkedInIcon,
  GitHubIcon,
  ArrowLeftIcon,
  ExternalLinkIcon,
  LockIcon,
} from './icons.jsx';

const NAV_LINKS = [
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

const CATEGORY_ACCENTS = ['bg-cyan-50 text-cyan-700', 'bg-violet-50 text-violet-700', 'bg-amber-50 text-amber-700', 'bg-emerald-50 text-emerald-700', 'bg-rose-50 text-rose-700', 'bg-sky-50 text-sky-700'];

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(delay, 0.4), ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function Section({ id, eyebrow, title, tone = 'white', children }) {
  const bg = tone === 'tint' ? 'bg-slate-50' : 'bg-white';
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={`${bg} scroll-mt-20`}>
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">{eyebrow}</div>
          <h2 id={`${id}-heading`} className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h2>
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function StatChip({ value, label }) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
      <div className="text-2xl font-extrabold text-white">{value}</div>
      <div className="text-xs font-medium uppercase tracking-wide text-cyan-100">{label}</div>
    </div>
  );
}

function SkillGroup({ category, i }) {
  const accent = CATEGORY_ACCENTS[i % CATEGORY_ACCENTS.length];
  return (
    <Reveal delay={i * 0.05} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold ${accent}`}>
        <span aria-hidden="true">{category.icon}</span>
        {category.title}
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {category.items.map((item) => (
          <li key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function ExperienceEntry({ entry, i, isLast }) {
  return (
    <Reveal delay={i * 0.08} className="relative flex gap-6">
      <div className="flex flex-col items-center">
        <span
          className={`mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ${entry.current ? 'bg-cyan-600 ring-cyan-100' : 'bg-slate-300 ring-slate-50'}`}
        />
        {!isLast && <span className="mt-1 w-px flex-1 bg-slate-200" />}
      </div>
      <div className={`flex-1 pb-10 ${isLast ? 'pb-0' : ''}`}>
        <div
          className={`rounded-2xl border p-6 ${entry.current ? 'border-cyan-200 bg-cyan-50/60' : 'border-slate-200 bg-white'}`}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-bold text-slate-900">{entry.org}</h3>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
              {entry.from} – {entry.to}
            </span>
          </div>
          <div className="mt-1 text-sm font-medium text-cyan-700">
            {entry.role} <span className="text-slate-400">·</span> {entry.location}
          </div>
          {entry.summary && <div className="mt-1 text-sm italic text-slate-500">{entry.summary}</div>}
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {entry.responsibilities.map((r) => (
              <li key={r} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}

function ProjectCard({ project, i }) {
  const hasGithub = Boolean(project.links?.github);
  const hasLive = Boolean(project.links?.live);
  return (
    <Reveal delay={(i % 4) * 0.06} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: project.color }} aria-hidden="true" />
      <div className="p-6 pl-7">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
            {project.year} · {project.status}
          </span>
        </div>
        <div className="text-sm font-medium" style={{ color: project.color }}>
          {project.tagline}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{project.desc}</p>
        {project.features?.length > 0 && (
          <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
            {project.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                {f}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
          {hasGithub && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 hover:text-cyan-900"
            >
              <ExternalLinkIcon width={14} height={14} /> Code
            </a>
          )}
          {hasLive && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 hover:text-cyan-900"
            >
              <ExternalLinkIcon width={14} height={14} /> Live
            </a>
          )}
          {!hasGithub && !hasLive && (
            <span
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400"
              title="Built at AllHeartWeb/KBS-IT — the codebase is employer-owned and not publicly shareable"
            >
              <LockIcon width={13} height={13} /> Private — employer-owned codebase
            </span>
          )}
        </div>
      </div>
    </Reveal>
  );
}

function ContactCard({ icon, label, value, href }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 group-hover:bg-cyan-100">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
        <div className="truncate text-sm font-semibold text-slate-800">{value}</div>
      </div>
    </a>
  );
}

export default function SimplePortfolio() {
  const currentRole = EXPERIENCE.find((e) => e.current) || EXPERIENCE[0];

  return (
    <div className="min-h-screen bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-cyan-700 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* Sticky nav */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 sm:px-8">
          <a href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-cyan-700">
            <ArrowLeftIcon width={16} height={16} /> Cinematic version
          </a>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Section navigation">
            {NAV_LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} className="text-sm font-medium text-slate-600 hover:text-cyan-700">
                {l.label}
              </a>
            ))}
          </nav>
          <ResumeButton variant="light" className="!px-3 !py-1.5 text-xs sm:!px-4 sm:!py-2 sm:text-sm" />
        </div>
      </header>

      <main id="main-content">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 15% 20%, rgba(34,211,238,0.35), transparent 40%), radial-gradient(circle at 85% 70%, rgba(129,140,248,0.3), transparent 45%)',
            }}
          />
          <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col items-start gap-8 sm:flex-row sm:items-center"
            >
              <img
                src="/ankit-photo.jpg"
                alt={PROFILE.name}
                width={128}
                height={128}
                className="h-28 w-28 shrink-0 rounded-2xl object-cover ring-4 ring-white/10 sm:h-32 sm:w-32"
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Hi, I'm</p>
                <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{PROFILE.name}</h1>
                <p className="mt-2 text-xl font-semibold text-cyan-300">{PROFILE.title}</p>
                <p className="mt-1 text-sm text-slate-300">
                  {PROFILE.location} <span className="mx-1.5 text-slate-500">·</span> {PROFILE.status}
                </p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-300"
            >
              {PROFILE.totalExperienceYears}+ years building scalable, enterprise-grade web applications with
              the MERN stack. Currently {currentRole.role} at <span className="font-semibold text-white">{currentRole.org}</span>
              {currentRole.summary ? `, ${currentRole.summary}.` : '.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <StatChip value={`${PROFILE.totalExperienceYears}+`} label="Years Experience" />
              <StatChip value={PROJECTS.length} label="Projects Shipped" />
              <StatChip value={SKILL_CATEGORIES.length} label="Skill Areas" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <ResumeButton variant="light" />
              <a
                href={`mailto:${CONTACT.email}?subject=Opportunity%20for%20Ankit%20Kumar`}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10"
              >
                <MailIcon width={16} height={16} /> Get in touch
              </a>
              <div className="ml-1 flex items-center gap-2">
                <a
                  href={`https://${CONTACT.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <LinkedInIcon />
                </a>
                <a
                  href={`https://${CONTACT.github}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <GitHubIcon />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Angled divider into the next section, inspired by common portfolio hero treatments */}
          <svg
            className="relative block w-full text-white"
            viewBox="0 0 1440 48"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{ height: '36px' }}
          >
            <polygon points="0,48 1440,48 1440,0" fill="currentColor" />
          </svg>
        </div>

        <Section id="skills" eyebrow="What I work with" title="Technical Skills" tone="white">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SKILL_CATEGORIES.map((category, i) => (
              <SkillGroup key={category.id} category={category} i={i} />
            ))}
          </div>
        </Section>

        <Section id="experience" eyebrow="Where I've worked" title="Professional Experience" tone="tint">
          <div className="space-y-0">
            {EXPERIENCE.map((entry, i) => (
              <ExperienceEntry key={entry.id} entry={entry} i={i} isLast={i === EXPERIENCE.length - 1} />
            ))}
          </div>
        </Section>

        <Section id="projects" eyebrow="What I've shipped" title="Featured Projects" tone="white">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {PROJECTS.map((project, i) => (
              <ProjectCard key={project.id} project={project} i={i} />
            ))}
          </div>
        </Section>

        <Section id="education" eyebrow="Academic background" title="Education" tone="tint">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {EDUCATION.map((entry, i) => (
              <Reveal key={entry.id} delay={i * 0.08} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-bold text-slate-900">{entry.degree}</h3>
                <div className="mt-1 text-sm font-medium text-cyan-700">{entry.institution}</div>
                <div className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  {entry.from} – {entry.to}
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="contact" eyebrow="Let's talk" title="Get In Touch" tone="white">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ContactCard icon={<MailIcon />} label="Email" value={CONTACT.email} href={`mailto:${CONTACT.email}`} />
            <ContactCard icon={<PhoneIcon />} label="Phone" value={CONTACT.phone} href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`} />
            <ContactCard icon={<LinkedInIcon />} label="LinkedIn" value={CONTACT.linkedin} href={`https://${CONTACT.linkedin}`} />
            <ContactCard icon={<GitHubIcon />} label="GitHub" value={CONTACT.github} href={`https://${CONTACT.github}`} />
          </div>
          <Reveal delay={0.2} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={`mailto:${CONTACT.email}?subject=Opportunity%20for%20Ankit%20Kumar`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <MailIcon width={16} height={16} /> Send Hiring Email
            </a>
            <ResumeButton variant="light" className="justify-center" />
          </Reveal>
        </Section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500">
        {PROFILE.name} · {PROFILE.location}
      </footer>
    </div>
  );
}
