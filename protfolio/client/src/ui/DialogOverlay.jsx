import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { askAnkitAI } from '../ai/aiClient';
import { BLOCKS } from '../data/ankitProfile';

const QUICK_COMMANDS = [
  { label: '/skills', prompt: 'skills' },
  { label: '/projects', prompt: 'projects' },
  { label: '/experience', prompt: 'experience' },
  { label: '/education', prompt: 'education' },
  { label: '/contact', prompt: 'contact' },
  { label: '/hire', prompt: 'hire' },
];

export default function DialogOverlay() {
  const dialog = useGame((s) => s.ui.dialog);
  const advance = useGame((s) => s.advanceDialog);
  const close = useGame((s) => s.closeDialog);
  const pushLine = useGame((s) => s.pushDialogLine);
  const [aiInput, setAiInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const inputRef = useRef();
  const scrollerRef = useRef();

  useEffect(() => {
    const onKey = (e) => {
      if (!dialog) return;
      if (e.code === 'Escape') close();
      if (!dialog.npc?.ai && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dialog, advance, close]);

  // Auto-scroll the AI transcript to the bottom on new lines.
  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [dialog?.lines?.length, thinking]);

  if (!dialog) return null;
  const { npc, lines, index } = dialog;
  const line = lines[index];
  const isAI = !!npc?.ai;

  const send = async (rawPrompt) => {
    const prompt = (rawPrompt ?? aiInput).trim();
    if (!prompt || thinking) return;
    pushLine(`You: ${prompt}`);
    setAiInput('');
    setThinking(true);
    const reply = await askAnkitAI(prompt);
    pushLine(`${npc.name}: ${reply}`);
    setThinking(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="absolute left-1/2 -translate-x-1/2 bottom-8 z-40 w-[min(760px,92vw)] glass rounded-2xl p-5"
      >
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <div className="font-display text-lg" style={{ color: npc.color }}>{npc.name}</div>
            {isAI && (
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-100/50">
                online · ankit-ai
              </span>
            )}
          </div>
          <button className="text-xs font-mono text-cyan-100/60" onClick={close}>
            [ESC] close
          </button>
        </div>

        {isAI ? (
          <div className="space-y-3">
            <div
              ref={scrollerRef}
              className="max-h-72 overflow-y-auto pr-2 space-y-2 font-mono text-sm text-cyan-100/90"
            >
              {lines.map((l, i) => {
                const isUser = l.startsWith('You: ');
                const body = isUser ? l.slice(5) : l.replace(`${npc.name}: `, '');
                return (
                  <pre
                    key={i}
                    className={`whitespace-pre-wrap leading-relaxed ${
                      isUser ? 'text-neon-yellow' : 'text-cyan-100/90'
                    }`}
                  >
                    {isUser ? `> ${body}` : body}
                  </pre>
                );
              })}
              {thinking && <div className="text-cyan-100/50 italic">…thinking</div>}
            </div>

            {/* Quick command chips */}
            <div className="flex flex-wrap gap-1.5">
              {QUICK_COMMANDS.map((c) => (
                <button
                  key={c.label}
                  className="px-2.5 py-1 rounded-full bg-cyan-100/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 text-[11px] font-mono uppercase tracking-widest"
                  onClick={() => send(c.prompt)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                ref={inputRef}
                autoFocus
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.code === 'Enter' && send()}
                placeholder='Ask Ankit AI anything — try "skills" or "hire"'
                className="flex-1 bg-black/40 border border-neon-cyan/40 rounded-md px-3 py-2 text-sm font-mono outline-none focus:border-neon-cyan"
              />
              <button className="btn btn-primary" onClick={() => send()} disabled={thinking}>
                Send
              </button>
            </div>
          </div>
        ) : (
          <>
            <pre className="font-mono text-base leading-relaxed text-cyan-100/95 min-h-[2.5rem] whitespace-pre-wrap">
              {line}
            </pre>
            <div className="mt-3 flex items-center justify-between text-xs font-mono text-cyan-100/60">
              <div>{index + 1} / {lines.length}</div>
              <button className="btn" onClick={advance}>
                {index + 1 >= lines.length ? 'Close' : 'Next →'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
