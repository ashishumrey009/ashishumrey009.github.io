import React, { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────────────────
   QuestRoadmap — "The Quest"
   An RPG skill-tree showing 2014–2017 as a character who leveled up across
   two disciplines before choosing the final path.
   ───────────────────────────────────────────────────────────────────────── */

const STYLES = `
  .qr-root {
    position: relative;
    padding: 0 0 24px;
    font-family: var(--heading-font);
  }

  /* ── Header ── */
  .qr-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px 28px 20px;
    flex-wrap: wrap; gap: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .qr-header-left { display: flex; align-items: center; gap: 14px; }
  .qr-icon {
    width: 46px; height: 46px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
    background: linear-gradient(135deg, rgba(245,158,11,0.12), rgba(124,58,237,0.08));
    border: 1px solid rgba(245,158,11,0.15);
    box-shadow: 0 0 20px rgba(245,158,11,0.06);
  }
  .qr-title {
    font-size: 1.1rem; font-weight: 800; color: #fff;
    letter-spacing: -0.02em;
  }
  .qr-sub {
    font-size: 0.73rem; color: rgba(148,163,184,0.6);
    margin-top: 2px;
    font-family: var(--mono-font); letter-spacing: 0.03em;
  }
  .qr-badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 16px; border-radius: 999px;
    font-family: var(--mono-font);
    font-size: 0.68rem; font-weight: 600;
    color: rgba(252,211,77,0.9);
    background: rgba(245,158,11,0.06);
    border: 1px solid rgba(245,158,11,0.15);
    letter-spacing: 0.04em;
  }

  /* ── Character banner ── */
  .qr-character {
    display: flex; align-items: center; gap: 16px;
    margin: 20px 28px 24px;
    padding: 16px 20px;
    border-radius: 14px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    position: relative; overflow: hidden;
  }
  .qr-character::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent);
  }
  .qr-avatar {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; flex-shrink: 0;
    background: linear-gradient(135deg, rgba(245,158,11,0.1), rgba(124,58,237,0.08));
    border: 1px solid rgba(245,158,11,0.15);
  }
  .qr-char-info { flex: 1; min-width: 0; }
  .qr-char-name {
    font-size: 0.95rem; font-weight: 700; color: #fff;
    letter-spacing: -0.01em; margin-bottom: 3px;
  }
  .qr-char-class {
    font-family: var(--mono-font);
    font-size: 0.65rem; color: rgba(245,158,11,0.7);
    letter-spacing: 0.08em; text-transform: uppercase;
  }
  .qr-xp-bar-wrap { flex: 1; min-width: 120px; }
  .qr-xp-label {
    display: flex; justify-content: space-between;
    font-family: var(--mono-font);
    font-size: 0.6rem; color: rgba(148,163,184,0.5);
    margin-bottom: 5px;
  }
  .qr-xp-track {
    height: 6px; border-radius: 999px;
    background: rgba(255,255,255,0.05);
    overflow: hidden;
  }
  .qr-xp-fill {
    height: 100%; border-radius: 999px;
    background: linear-gradient(90deg, #F59E0B, #EF4444, #7C3AED);
    width: 0;
    transition: width 2s cubic-bezier(0.22, 1, 0.36, 1) 0.5s;
    box-shadow: 0 0 8px rgba(245,158,11,0.3);
  }
  .qr-xp-fill.active { width: 87%; }

  /* ── Skill Tree Grid ── */
  .qr-tree {
    padding: 0 28px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* ── Connector line between rows ── */
  .qr-connector {
    display: flex; align-items: center; justify-content: center;
    height: 32px; position: relative;
  }
  .qr-connector-line {
    width: 2px;
    height: 100%;
    background: linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
  }
  .qr-connector-fork {
    display: flex; align-items: flex-start; justify-content: center;
    position: relative; width: 100%; height: 40px;
  }
  .qr-fork-line-center {
    width: 2px; height: 24px;
    background: rgba(255,255,255,0.06);
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  }
  .qr-fork-line-h {
    position: absolute; top: 24px; left: 15%; right: 15%;
    height: 2px;
    background: rgba(255,255,255,0.06);
  }
  .qr-fork-line-down-left {
    position: absolute; top: 24px; left: 15%;
    width: 2px; height: 16px;
    background: rgba(16,185,129,0.3);
    transform: translateX(-50%);
  }
  .qr-fork-line-down-right {
    position: absolute; top: 24px; right: 15%;
    width: 2px; height: 16px;
    background: rgba(124,58,237,0.3);
    transform: translateX(50%);
  }

  /* Rejoin connector */
  .qr-rejoin {
    display: flex; align-items: flex-start; justify-content: center;
    position: relative; width: 100%; height: 40px;
  }
  .qr-rejoin-line-h {
    position: absolute; top: 0; left: 15%; right: 15%;
    height: 2px;
    background: rgba(255,255,255,0.06);
  }
  .qr-rejoin-line-up-left {
    position: absolute; top: 0; left: 15%;
    width: 2px; height: 24px;
    background: rgba(245,158,11,0.3);
    transform: translateX(-50%);
  }
  .qr-rejoin-line-up-right {
    position: absolute; top: 0; right: 15%;
    width: 2px; height: 24px;
    background: rgba(245,158,11,0.3);
    transform: translateX(50%);
  }
  .qr-rejoin-line-center {
    width: 2px; height: 16px;
    background: rgba(245,158,11,0.4);
    position: absolute; top: 24px; left: 50%; transform: translateX(-50%);
  }

  /* ── Skill node ── */
  .qr-node-row {
    display: flex; gap: 12px;
  }
  .qr-node-row.single { justify-content: center; }
  .qr-node-row.dual { justify-content: space-between; }

  .qr-node {
    flex: 1;
    padding: 16px 18px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(12, 12, 18, 0.7);
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1),
                transform 0.7s cubic-bezier(0.22,1,0.36,1),
                border-color 0.3s ease,
                box-shadow 0.3s ease;
    cursor: default;
  }
  .qr-node.visible { opacity: 1; transform: translateY(0); }
  .qr-node::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px; border-radius: 2px 2px 0 0;
  }

  /* Node variants */
  .qr-node.origin { border-color: rgba(245,158,11,0.2); max-width: 320px; }
  .qr-node.origin::before { background: linear-gradient(90deg, #F59E0B, #EF4444); }
  .qr-node.origin:hover { border-color: rgba(245,158,11,0.4); box-shadow: 0 8px 32px rgba(245,158,11,0.08); }

  .qr-node.govt { border-color: rgba(16,185,129,0.15); }
  .qr-node.govt::before { background: linear-gradient(90deg, #10B981, #34D399); }
  .qr-node.govt:hover { border-color: rgba(16,185,129,0.3); box-shadow: 0 8px 24px rgba(16,185,129,0.06); }

  .qr-node.tech { border-color: rgba(124,58,237,0.15); }
  .qr-node.tech::before { background: linear-gradient(90deg, #7C3AED, #A78BFA); }
  .qr-node.tech:hover { border-color: rgba(124,58,237,0.3); box-shadow: 0 8px 24px rgba(124,58,237,0.08); }

  .qr-node.final { border-color: rgba(245,158,11,0.25); max-width: 360px; }
  .qr-node.final::before { background: linear-gradient(90deg, #F59E0B, #7C3AED, #10B981); }
  .qr-node.final:hover { border-color: rgba(245,158,11,0.45); box-shadow: 0 12px 40px rgba(245,158,11,0.1); }

  /* Node content */
  .qr-node-top { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
  .qr-node-emoji {
    font-size: 1.5rem; flex-shrink: 0;
    filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
  }
  .qr-node-meta { flex: 1; min-width: 0; }
  .qr-node-level {
    font-family: var(--mono-font);
    font-size: 0.58rem; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    margin-bottom: 3px;
    opacity: 0.6;
  }
  .qr-node-name {
    font-size: 0.92rem; font-weight: 700; color: #fff;
    letter-spacing: -0.01em; line-height: 1.2;
  }
  .qr-node-desc {
    font-size: 0.74rem; color: rgba(148,163,184,0.75);
    line-height: 1.6; margin-bottom: 12px;
  }

  /* Skill chips inside nodes */
  .qr-skills { display: flex; flex-wrap: wrap; gap: 6px; }
  .qr-skill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 10px; border-radius: 8px;
    font-family: var(--mono-font);
    font-size: 0.65rem; font-weight: 600;
    letter-spacing: 0.04em;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    color: rgba(203,213,225,0.8);
    transition: all 0.3s ease;
  }
  .qr-skill.unlocked {
    background: rgba(16,185,129,0.07);
    border-color: rgba(16,185,129,0.15);
    color: #6EE7B7;
  }
  .qr-skill.unlocked-purple {
    background: rgba(124,58,237,0.07);
    border-color: rgba(124,58,237,0.15);
    color: #C4B5FD;
  }
  .qr-skill.unlocked-gold {
    background: rgba(245,158,11,0.07);
    border-color: rgba(245,158,11,0.15);
    color: #FCD34D;
  }
  .qr-skill-check { font-size: 0.6rem; }

  /* ── Quote ── */
  .qr-quote {
    margin: 20px 28px 0;
    padding: 16px 20px 16px 24px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(245,158,11,0.04), rgba(124,58,237,0.02));
    border: 1px solid rgba(245,158,11,0.1);
    position: relative; overflow: hidden;
  }
  .qr-quote::after {
    content: '';
    position: absolute; top: 0; left: 0; bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, #F59E0B, rgba(245,158,11,0.2));
    border-radius: 3px 0 0 3px;
  }
  .qr-quote-text {
    position: relative;
    font-size: 0.8rem; color: rgba(241,245,249,0.8);
    font-style: italic; line-height: 1.7;
  }
  .qr-quote-text strong { color: #FCD34D; font-style: normal; font-weight: 600; }
`;

const NODES = [
  {
    id: 'origin',
    type: 'origin',
    row: 'single',
    delay: 0,
    emoji: '⚔️',
    level: 'Chapter 01 · The Crossroads',
    levelColor: '#F59E0B',
    name: 'Left TCS — Chose the Unknown',
    desc: '3 years of corporate experience banked. Now: pursue what truly matters.',
    skills: [
      { label: '+3 Yrs Industry XP', type: 'unlocked-gold' },
      { label: '+Problem Solving', type: 'unlocked-gold' },
      { label: '+Decision Courage', type: 'unlocked-gold' },
    ],
  },
  {
    id: 'fork',
    type: 'fork',
  },
  {
    id: 'dual',
    type: 'dual',
    row: 'dual',
    delay: 200,
    left: {
      type: 'govt',
      emoji: '🏛️',
      level: 'Path A · Explored',
      levelColor: '#10B981',
      name: 'Government & Teaching',
      desc: 'Cracked competitive exams. Proved discipline in a completely different arena.',
      skills: [
        { label: '✓ CGPSC Cleared', type: 'unlocked' },
        { label: '✓ Final Interview', type: 'unlocked' },
        { label: '✓ Waiting List', type: 'unlocked' },
        { label: '+Discipline', type: 'unlocked' },
      ],
    },
    right: {
      type: 'tech',
      emoji: '📡',
      level: 'Path B · Chosen',
      levelColor: '#A78BFA',
      name: 'Higher Education',
      desc: 'Cracked GATE three times. Refused to settle until the best university said yes.',
      skills: [
        { label: '✓ GATE 2015', type: 'unlocked-purple' },
        { label: '✓ GATE 2016', type: 'unlocked-purple' },
        { label: '✓ GATE 2017', type: 'unlocked-purple' },
        { label: '+Perseverance ×3', type: 'unlocked-purple' },
      ],
    },
  },
  {
    id: 'rejoin',
    type: 'rejoin',
  },
  {
    id: 'final',
    type: 'final',
    row: 'single',
    delay: 400,
    emoji: '🎓',
    level: 'Chapter 03 · Final Unlock',
    levelColor: '#F59E0B',
    name: 'M.Tech @ MNNIT Allahabad',
    desc: 'Both paths converged here. The discipline from Govt prep + the persistence from GATE ×3 — combined into one admission.',
    skills: [
      { label: '✓ M.Tech Admitted', type: 'unlocked-gold' },
      { label: '+Research Thinking', type: 'unlocked-gold' },
      { label: '+Systems Design', type: 'unlocked-gold' },
      { label: '+Academic Excellence', type: 'unlocked-gold' },
    ],
  },
];

function SkillNode({ data, extraClass = '', style = {} }) {
  return (
    <div className={`qr-node ${data.type} ${extraClass}`} style={style}>
      <div className="qr-node-top">
        <div className="qr-node-emoji">{data.emoji}</div>
        <div className="qr-node-meta">
          <div className="qr-node-level" style={{ color: data.levelColor }}>{data.level}</div>
          <div className="qr-node-name">{data.name}</div>
        </div>
      </div>
      <div className="qr-node-desc">{data.desc}</div>
      <div className="qr-skills">
        {data.skills.map((s, i) => (
          <span key={i} className={`qr-skill ${s.type}`}>
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function QuestRoadmap() {
  const rootRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [xpActive, setXpActive] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setTimeout(() => setXpActive(true), 300);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="qr-root">
      <style>{STYLES}</style>

      {/* Header */}
      <div className="qr-header">
        <div className="qr-header-left">
          <div className="qr-icon">⚔️</div>
          <div>
            <div className="qr-title">The Quest</div>
            <div className="qr-sub">SAVE_FILE · 2014–2017 · EXPLORATION_ARC</div>
          </div>
        </div>
        <div className="qr-badge">
          <span style={{ color: '#F59E0B' }}>◆</span> 2014 – 2017
        </div>
      </div>

      {/* Character Card */}
      <div className="qr-character">
        <div className="qr-avatar">🧙</div>
        <div className="qr-char-info">
          <div className="qr-char-name">Ashish Umrey</div>
          <div className="qr-char-class">Class: Senior Engineer · Spec: Full Stack</div>
        </div>
        <div className="qr-xp-bar-wrap">
          <div className="qr-xp-label">
            <span>XP BAR · 2014–2017</span>
            <span>87 / 100</span>
          </div>
          <div className="qr-xp-track">
            <div className={`qr-xp-fill${xpActive ? ' active' : ''}`} />
          </div>
        </div>
      </div>

      {/* Skill Tree */}
      <div className="qr-tree">

        {/* Origin node */}
        <div className="qr-node-row single">
          <SkillNode
            data={NODES[0]}
            extraClass={visible ? 'visible' : ''}
            style={{ transitionDelay: '0ms' }}
          />
        </div>

        {/* Fork connector */}
        <div className="qr-connector-fork">
          <div className="qr-fork-line-center" />
          <div className="qr-fork-line-h" />
          <div className="qr-fork-line-down-left" />
          <div className="qr-fork-line-down-right" />
        </div>

        {/* Dual nodes */}
        <div className="qr-node-row dual">
          <SkillNode
            data={NODES[2].left}
            extraClass={visible ? 'visible' : ''}
            style={{ transitionDelay: '200ms' }}
          />
          <SkillNode
            data={NODES[2].right}
            extraClass={visible ? 'visible' : ''}
            style={{ transitionDelay: '350ms' }}
          />
        </div>

        {/* Rejoin connector */}
        <div className="qr-rejoin">
          <div className="qr-rejoin-line-h" />
          <div className="qr-rejoin-line-up-left" />
          <div className="qr-rejoin-line-up-right" />
          <div className="qr-rejoin-line-center" />
        </div>

        {/* Final node */}
        <div className="qr-node-row single">
          <SkillNode
            data={NODES[4]}
            extraClass={visible ? 'visible' : ''}
            style={{ transitionDelay: '500ms' }}
          />
        </div>

      </div>

      {/* Quote */}
      <div className="qr-quote">
        <div className="qr-quote-text">
          The gap wasn't a setback — it was a <strong>deliberate grind.</strong>{' '}
          I walked two roads simultaneously, unlocked skills in both, and chose the path that would push me furthest.
        </div>
      </div>
    </div>
  );
}
